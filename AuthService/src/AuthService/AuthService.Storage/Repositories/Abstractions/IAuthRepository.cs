using AuthService.Domain.Models;

namespace AuthService.Storage.Repositories.Abstractions;

public interface IAuthRepository
{
    IBaseRepository<User> Users { get; init; }
    IBaseRepository<Session> Sessions { get; init; }
    IBaseRepository<Role> Roles { get; init; }
    IBaseRepository<UserRole> UserRoles { get; init; }
}