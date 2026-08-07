namespace AuthService.Domain.DTOs.Options;

public sealed class SessionOptions
{
    public TimeSpan Lifetime { get; init; }
    public TimeSpan IdleTimeout { get; init; }
}