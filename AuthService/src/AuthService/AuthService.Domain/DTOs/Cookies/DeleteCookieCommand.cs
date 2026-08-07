using AuthService.Domain.DTOs.Cookies.Base;

namespace AuthService.Domain.DTOs.Cookies;

public sealed class DeleteCookieCommand : ICookieCommand
{
    public required string Name { get; init; }
}