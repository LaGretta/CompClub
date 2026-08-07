using System.Linq.Expressions;
using System.Security.Cryptography;
using System.Text;
using AuthService.Domain.Abstractions.Queues;
using AuthService.Domain.DTOs.Cache;
using AuthService.Domain.Queries;

namespace AuthService.Storage.Queries;

public static class QueryKeyGenerator
{
    public static string Generate<TEntity>(QueryExecutionContext<TEntity> queryExecutionContext)
    {
        var builder = new StringBuilder();
        //Entity
        builder.Append("Entity:");
        builder.Append(typeof(TEntity).FullName);
        //Result
        builder.Append("|Result:");
        builder.Append((int)queryExecutionContext.ResultKind);
        //IgnoreQueryFilters
        builder.Append("|IgnoreQueryFilters:");
        builder.Append(queryExecutionContext.IgnoreQueryFilters ? 1 : 0);
        //Predicate
        if (queryExecutionContext.Query.Predicate is not null)
            SerializePredicate(builder, queryExecutionContext.Query.Predicate);
        //Orderings
        if (queryExecutionContext.Query.Orderings is not null)
            SerializeOrderings(builder, queryExecutionContext.Query.Orderings);
        //Pagination
        if (queryExecutionContext.Query.Pagination is not null)
            SerializePagination(builder, queryExecutionContext.Query.Pagination);

        return builder.ToString();
    }
    private static void SerializePredicate<TEntity>(StringBuilder builder, Expression<Func<TEntity, bool>>? predicate)
    {
        if (predicate is not null)
            builder.Append("|Predicate:"+predicate.Serialize());
        
    }

    private static void SerializeOrderings<TEntity>(StringBuilder builder, IReadOnlyCollection<IOrderByQuery<TEntity>> orderings)
    {
        foreach (var ordering in orderings)
            builder.Append("|Ordering:"+GetMemberName(ordering.KeySelector) + ':' + ordering.Direction);
    }
    private static void SerializePagination(StringBuilder builder, PaginationQuery pagination)
    {
        builder.Append("|Pagination:"+pagination.Skip+','+pagination.PageSize);
    }
    private static string GetMemberName(Expression expression)
    {
        if (expression is UnaryExpression unary)
            expression = unary.Operand;

        return ((MemberExpression)expression).Member.Name;
    }
}