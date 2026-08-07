using AuthService.Domain.Enums.Cache;
using AuthService.Domain.Queries;

namespace AuthService.Domain.DTOs.Cache;

public sealed class QueryExecutionContext<TEntity>
{
    public required Query<TEntity> Query { get; init; }
    public bool IgnoreQueryFilters { get; init; }
    
    //public bool IgnoreAutoIncludes { get; init; }
    
    public QueryResultKind ResultKind { get; init; }
}