using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging; 

namespace PCClubBooking.Api.Middleware;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;  

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)  
    {
        _logger = logger;
    }
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext
        , Exception exception
        , CancellationToken ct)
    {
        var statusCode = exception switch
        {
            KeyNotFoundException => StatusCodes.Status404NotFound,
            InvalidOperationException => StatusCodes.Status409Conflict,
            ArgumentException => StatusCodes.Status400BadRequest,
            _ => StatusCodes.Status500InternalServerError,
        };

        if (statusCode == StatusCodes.Status500InternalServerError)
            _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
        else
            _logger.LogWarning("Handled {ExceptionType}: {Message}",
                exception.GetType().Name, exception.Message);

        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = exception.GetType().Name,
            Detail = exception.Message,
        };
        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(problem, ct);
        return true;
    }
}