using Microsoft.Extensions.Caching.Memory;

namespace AuthService.Domain.DTOs.Options.Cache;

public sealed class CacheEntryPolicy
{
    public TimeSpan? AbsoluteExpiration { get; init; }
    public TimeSpan? SlidingExpiration { get; init; }
    public CacheItemPriority Priority { get; init; } = CacheItemPriority.Normal;
}