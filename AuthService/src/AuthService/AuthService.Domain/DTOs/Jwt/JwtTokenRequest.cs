namespace AuthService.Domain.DTOs.Jwt;

public sealed class JwtTokenRequest
{
    public Guid UserId { get; init; }

    public string UserName { get; init; } = null!;

    public string Email { get; init; } = null!;

    public IReadOnlyCollection<Guid> RoleIds { get; init; } = [];
}