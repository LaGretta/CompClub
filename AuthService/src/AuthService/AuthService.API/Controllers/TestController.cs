using AuthService.Application.Tools;

namespace AuthService.API.Controllers;



public static class TestController
{
    public static IEndpointRouteBuilder UseTestEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/v1/test");
     
        group.MapPost("/",  (HttpContext httpContext) =>
        {
            try
            {
                var ipAddress = httpContext.GetClientIpAddress();
                return Results.Ok($"greate hello from auth service is your ip is {ipAddress}?");
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }
        });
        return app;
    }
}