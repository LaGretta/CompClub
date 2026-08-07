using AuthService.Domain.Abstractions.Models;
using AuthService.Domain.Models.Base;

namespace AuthService.Domain.Models;

public sealed class User : EntityBase, IAuditable, ISoftDeletable
{
    public string UserName { get; set; }
    public string Email { get; set; }
    public string PasswordHash  { get; set; }
    //
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    //
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    //
    public ICollection<Session> Sessions { get; set; } = new List<Session>();
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}