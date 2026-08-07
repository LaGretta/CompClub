using System.Linq.Expressions;
using AuthService.Domain.Enums.Queries;

namespace AuthService.Domain.Abstractions.Queues;

public interface IOrderByQuery<TEntity>
{
    LambdaExpression KeySelector { get; }
    
    SortDirection Direction { get; }

}