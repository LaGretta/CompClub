using AuthService.Application.Results.Auth.Base;

namespace AuthService.Application.Results.Auth;

public class RefreshTokenResult
{
    public required string AccessToken {get; init;}
}