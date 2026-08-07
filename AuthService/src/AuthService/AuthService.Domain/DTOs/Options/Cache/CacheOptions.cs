namespace AuthService.Domain.DTOs.Options.Cache;

public sealed class CacheOptions
{
    public CacheEntryPolicy User { get; init; } = new();
    public CacheEntryPolicy Session { get; init; } = new();
    public CacheEntryPolicy Role { get; init; } = new();
    public CacheEntryPolicy UserRole { get; init; } = new();
}