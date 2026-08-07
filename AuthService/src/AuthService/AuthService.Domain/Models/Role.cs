using AuthService.Domain.Models.Base;

namespace AuthService.Domain.Models;

public sealed class Role: EntityBase
{
    public string Name { get; set; } = null!;

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}