using System.Linq.Expressions;
using AuthService.Domain.Abstractions.Queues;

namespace AuthService.Domain.Queries;

public sealed class ReferenceIncludeQuery<TEntity, TChild>: IIncludeQuery<TEntity>
{
    public required Expression<Func<TEntity, TChild>> Navigation { get; init; }
    //
    public IReadOnlyCollection<IIncludeQuery<TChild>> Includes { get; init; } = [];
}