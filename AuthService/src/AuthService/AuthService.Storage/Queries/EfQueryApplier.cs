using System.Linq.Expressions;
using AuthService.Domain.Abstractions.Queues;
using AuthService.Domain.Enums.Queries;
using AuthService.Domain.Queries;
using AuthService.Domain.Queries.ExecutionOptions;

namespace AuthService.Storage.Queries;

internal static class EfQueryApplier
{
    public static IQueryable<TEntity> Apply<TEntity>(IQueryable<TEntity> query, Query<TEntity> specification)
    {
        query = ApplyPredicate(query, specification);
        query = ApplyOrderBy(query, specification);
        query = ApplyPagination(query, specification);

        return query;
    }

    private static IQueryable<TEntity> ApplyPredicate<TEntity>(IQueryable<TEntity> query, Query<TEntity> specification)
    {
        if (specification.Predicate is null)
            return query;

        return query.Where(specification.Predicate);
    }

    private static IQueryable<TEntity> ApplyOrdering<TEntity>(IQueryable<TEntity> query, IOrderByQuery<TEntity> ordering)
    {
        bool ordered = query is IOrderedQueryable<TEntity>;

        var method = (ordered, ordering.Direction) switch
        {
            (false, SortDirection.Ascending) => nameof(Queryable.OrderBy),
            (false, SortDirection.Descending) => nameof(Queryable.OrderByDescending),
            (true, SortDirection.Ascending) => nameof(Queryable.ThenBy),
            _ => nameof(Queryable.ThenByDescending)
        };
        
        var expression = Expression.Call(
            typeof(Queryable),
            method,
            [typeof(TEntity), ordering.KeySelector.ReturnType],
            query.Expression,
            Expression.Quote(ordering.KeySelector));

        return query.Provider.CreateQuery<TEntity>(expression);
    }
    private static IQueryable<TEntity> ApplyOrderBy<TEntity>(IQueryable<TEntity> query, Query<TEntity> specification)
    {
        if (specification.Orderings.Count == 0)
            return query;

        foreach (var ordering in specification.Orderings)
        {
            query = ApplyOrdering(query, ordering);
        }

        return query;
    }
    
    private static IQueryable<TEntity> ApplyPagination<TEntity>(IQueryable<TEntity> query, Query<TEntity> specification)
    {
        if (specification.Pagination is null)
            return query;

        return query
            .Skip(specification.Pagination.Skip)
            .Take(specification.Pagination.PageSize);
    }

}