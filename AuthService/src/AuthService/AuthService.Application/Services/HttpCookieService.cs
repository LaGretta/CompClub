using AuthService.Application.Services.Abstractions;
using AuthService.Domain.DTOs.Cookies;
using AuthService.Domain.DTOs.Cookies.Base;
using Microsoft.AspNetCore.Http;

namespace AuthService.Application.Services;

public class HttpCookieService : IHttpCookieService
{
    public void Apply(HttpResponse response, IEnumerable<ICookieCommand> commands)
    {
        foreach (var command in commands)
        {
            switch (command)
            {
                case AppendCookieCommand append:
                    response.Cookies.Append(
                        append.Name,
                        append.Value,
                        new CookieOptions
                        {
                            HttpOnly = append.HttpOnly,
                            Secure = append.Secure,
                            SameSite = append.SameSite,
                            Expires = append.ExpiresAt
                        });
                    break;

                case DeleteCookieCommand delete:
                    response.Cookies.Delete(delete.Name);
                    break;
            }
        }
    }
}