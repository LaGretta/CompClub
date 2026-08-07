using System.Linq.Expressions;
using AuthService.Domain.Abstractions.Queues;

namespace AuthService.Domain.Queries;

public sealed class Query<TEntity>
{
    public Expression<Func<TEntity, bool>>? Predicate { get; init; }
    public IReadOnlyCollection<IOrderByQuery<TEntity>>? Orderings { get; init; } = [];
    public PaginationQuery? Pagination { get; init; }
    //
    //public IReadOnlyCollection<IIncludeQuery<TEntity>> Includes { get; init; } = [];//ReferenceIncludeQuery || CollectionIncludeQuery
}