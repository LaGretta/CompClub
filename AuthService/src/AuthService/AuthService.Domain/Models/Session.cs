using AuthService.Domain.Abstractions.Models;
using AuthService.Domain.Models.Base;

namespace AuthService.Domain.Models;

public sealed class Session: EntityBase, IAuditable
{
    public string TokenHash { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public DateTime? RevokedAt { get; set; }
    public DateTime LastUsedAt { get; set; }= DateTime.UtcNow;
    public string? IpAddress {get; set; }
    public string? UserAgent  { get; set; }
    //
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    //
    public User User { get; set; }
    public Guid UserId { get; set; }
}