using AuthService.Domain.DTOs.Cache;

namespace AuthService.Shared.Abstractions;

public interface IMemoryCacheService
{
    Task<TResult> GetOrCreateAsync<TEntity, TResult>(QueryExecutionContext<TEntity> context, Func<Task<TResult>> factory);
    void Remove<TEntity>(QueryExecutionContext<TEntity> context);
}