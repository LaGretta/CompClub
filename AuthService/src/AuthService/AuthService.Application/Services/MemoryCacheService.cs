using AuthService.Application.Services.Abstractions;
using AuthService.Domain.DTOs.Cache;
using AuthService.Domain.DTOs.Options.Cache;
using AuthService.Domain.Exceptions.Services.Cache;
using AuthService.Domain.Models;
using AuthService.Shared.Abstractions;
using AuthService.Storage.Queries;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace AuthService.Application.Services;

public sealed class MemoryCacheService: IMemoryCacheService
{
    private readonly IMemoryCache _memoryCache;
    private readonly CacheOptions _options;
    private readonly Dictionary<Type, MemoryCacheEntryOptions> _cachePolicies;

    public MemoryCacheService(IMemoryCache memoryCache, IOptions<CacheOptions> options)
    {
        _memoryCache = memoryCache;
        _options = options.Value;
        _cachePolicies = new()
        {
            
            [typeof(User)] = ToMemoryCacheOptions(_options.User),
            [typeof(Session)] = ToMemoryCacheOptions(_options.Session),
            [typeof(Role)] = ToMemoryCacheOptions(_options.Role),
            [typeof(UserRole)] = ToMemoryCacheOptions(_options.UserRole)
        };
    }
    public async Task<TResult> GetOrCreateAsync<TEntity, TResult>(QueryExecutionContext<TEntity> context, Func<Task<TResult>> factory)
    {
        //
        var key = QueryKeyGenerator.Generate(context);
        //
        if (_memoryCache.TryGetValue(key, out TResult? value))
            return value!;
        value = await factory();
        //generic type definition
        if (!_cachePolicies.TryGetValue(typeof(TEntity), out MemoryCacheEntryOptions? options))
            throw new CachePolicyNotFoundException(typeof(TEntity));
        //
        _memoryCache.Set(key, value, options);
        //
        return value;
    }

    public void Remove<TEntity>(QueryExecutionContext<TEntity> context)
    {
        var key = QueryKeyGenerator.Generate(context);
        //
        _memoryCache.Remove(key);
        
    }

    private static MemoryCacheEntryOptions ToMemoryCacheOptions(CacheEntryPolicy policy)
    {
        var options = new MemoryCacheEntryOptions
        {
            Priority = policy.Priority
        };

        if (policy.AbsoluteExpiration is not null)
            options.AbsoluteExpirationRelativeToNow = policy.AbsoluteExpiration;

        if (policy.SlidingExpiration is not null)
            options.SlidingExpiration = policy.SlidingExpiration;
        return options;
    }
}