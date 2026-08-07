using AuthService.Application.Commands.User;
using AuthService.Application.Results.Auth;
using AuthService.Application.Results.Auth.Base;

namespace AuthService.Application.Services.Abstractions;

public interface IAuthService
{
    Task<AuthResult<RegisterUserResult>> Register(RegisterUserCommand request, CancellationToken cancellationToken);
    Task<AuthResult<LoginUserResult>> Login(LoginUserCommand request, CancellationToken cancellationToken);
    Task<AuthResult<RefreshTokenResult>> RefreshToken(RefreshUserTokenCommand request, CancellationToken cancellationToken);
    Task<AuthResult<LogoutUserResult>> Logout(LogoutUserCommand request, CancellationToken cancellationToken);
}