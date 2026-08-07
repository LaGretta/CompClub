using AuthService.Application.Commands.User.HttpCookies;

namespace AuthService.API.Controllers.Extensions;

public static class HttpRequestExtensions
{
    public static HttpCookiesDataset GetCookies(this HttpRequest request)
    {
        return new HttpCookiesDataset
        {
            RefreshToken = request.Cookies["refreshToken"]
        };
    }
}