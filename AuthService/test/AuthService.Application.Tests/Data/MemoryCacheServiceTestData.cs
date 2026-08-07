using AuthService.Domain.DTOs.Cache;
using AuthService.Domain.Enums.Cache;
using AuthService.Domain.Models;
using AuthService.Domain.Queries;
using Xunit;

namespace AuthService.Application.Tests.Data;

public class MemberCacheServiceTestData : TheoryData<QueryExecutionContext<User>>
{
    public MemberCacheServiceTestData()
    {
        Add( new QueryExecutionContext<User>
             {
                 Query = new Query<User>(),
                 IgnoreQueryFilters = false,
                 ResultKind = QueryResultKind.Collection
             });
        Add(new QueryExecutionContext<User>
             {
                 Query = new Query<User>
                 {
                     Pagination = new PaginationQuery(1, 10)
                 },
                 IgnoreQueryFilters = false,
                 ResultKind = QueryResultKind.Collection
             });
        Add(new QueryExecutionContext<User>
             {
                 Query = new Query<User>(),
                 IgnoreQueryFilters = true,
                 ResultKind = QueryResultKind.Single
             });
    }
}