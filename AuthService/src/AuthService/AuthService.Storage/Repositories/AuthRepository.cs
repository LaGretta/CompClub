using AuthService.Domain.Models;
using AuthService.Storage.Repositories.Abstractions;

namespace AuthService.Storage.Repositories;

public class AuthRepository: IAuthRepository
{
    public IBaseRepository<User> Users { get; init; }
    public IBaseRepository<Session> Sessions { get; init; }
    public IBaseRepository<Role> Roles { get; init; }
    public IBaseRepository<UserRole> UserRoles { get; init; }
    //
    public AuthRepository(IBaseRepository<User> users, IBaseRepository<Session> sessions, IBaseRepository<Role> roles,
        IBaseRepository<UserRole> userRoles)
    {
        Users = users;
        Sessions = sessions;
        Roles = roles;
        UserRoles = userRoles;
    }
}