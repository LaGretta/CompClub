using AuthService.Application.Results.Auth.Base;

namespace AuthService.Application.Results.Auth;

public sealed class RegisterUserResult
{
    public required string AccessToken {get; init;}
}