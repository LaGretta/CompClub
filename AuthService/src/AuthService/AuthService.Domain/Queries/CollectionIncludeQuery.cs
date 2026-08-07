using System.Linq.Expressions;
using AuthService.Domain.Abstractions.Queues;

namespace AuthService.Domain.Queries;

public sealed class CollectionIncludeQuery<TEntity, TChild>: IIncludeQuery<TEntity>
{
    public required Expression<Func<TEntity, IEnumerable<TChild>>> Navigation { get; init; }
    //
    public Expression<Func<TChild, bool>>? Predicate { get; init; }
    public IReadOnlyCollection<IOrderByQuery<TChild>>? Orderings { get; init; } = [];
    public PaginationQuery? Pagination { get; init; } = null;
    public IReadOnlyCollection<IIncludeQuery<TChild>> Includes { get; init; } = [];
}