using System.Linq.Expressions;
using AuthService.Domain.Abstractions.Queues;
using AuthService.Domain.Enums.Queries;

namespace AuthService.Domain.Queries;

public sealed class OrderByQuery<TEntity, TKey>: IOrderByQuery<TEntity>
{
    public required  Expression<Func<TEntity, TKey>> KeySelector { get; init; }
    LambdaExpression IOrderByQuery<TEntity>.KeySelector => KeySelector;

    public SortDirection Direction { get; init; }
}