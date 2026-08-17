using AuthService.Application.Commands.User;
using AuthService.Application.Commands.User.Avatar;
using AuthService.Application.Responses.Avatar;
using AuthService.Application.Results.Auth;
using AuthService.Application.Results.Auth.Base;

namespace AuthService.Application.Services.Abstractions;

public interface IAuthService
{
    Task<AuthResult<RegisterUserResult>> Register(RegisterUserCommand request, CancellationToken cancellationToken);
    Task<AuthResult<LoginUserResult>> Login(LoginUserCommand request, CancellationToken cancellationToken);
    Task<AuthResult<RefreshTokenResult>> RefreshToken(RefreshUserTokenCommand request, CancellationToken cancellationToken);
    Task<AuthResult<LogoutUserResult>> Logout(LogoutUserCommand request, CancellationToken cancellationToken);
    //Avatar management
    Task UploadAvatar(UploadAvatarCommand request, CancellationToken cancellationToken);
    Task<GetAvatarPresignedUrlResponse> GetAvatarPresignedUrl(GetAvatarPresignedUrlCommand request,
        CancellationToken cancellationToken);

    Task DeleteAvatar(DeleteAvatarCommand request, CancellationToken cancellationToken);
}