using AuthService.Domain.DTOs.Cookies.Base;
using Microsoft.AspNetCore.Http;

namespace AuthService.Application.Services.Abstractions;

public interface IHttpCookieService
{
    void Apply(HttpResponse response, IEnumerable<ICookieCommand> commands);
}