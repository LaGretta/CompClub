using AuthService.Domain.DTOs.Cookies.Base;

namespace AuthService.Application.Results.Auth.Base;

public class AuthResult<TResult> where TResult : class
{
    public required TResult Data { get; set; }
    //
    public IReadOnlyCollection<ICookieCommand> Cookies { get; init; }
        = [];
}