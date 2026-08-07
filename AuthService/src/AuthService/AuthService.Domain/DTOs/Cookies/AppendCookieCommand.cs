using AuthService.Domain.DTOs.Cookies.Base;
using Microsoft.AspNetCore.Http;

namespace AuthService.Domain.DTOs.Cookies;

public class AppendCookieCommand: ICookieCommand
{
    public required string Name { get; init; }
    public string Path { get; init; } = "/api/v1/auth";//*тільки для сервісу AuthService
    public required string Value { get; init; }
    public DateTimeOffset? ExpiresAt { get; init; }
    public bool HttpOnly { get; init; } = true;
    public bool Secure { get; init; } = true;
    public SameSiteMode  SameSite { get; init; } = SameSiteMode .Strict;
}