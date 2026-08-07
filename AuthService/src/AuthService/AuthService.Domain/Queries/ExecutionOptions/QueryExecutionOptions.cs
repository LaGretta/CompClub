using AuthService.Domain.Enums.Queries;

namespace AuthService.Domain.Queries.ExecutionOptions;

public sealed class QueryExecutionOptions
{
    public QueryTracking Tracking { get; init; } = QueryTracking.Default;
    //
    public bool IgnoreQueryFilters { get; init; } = false;
}