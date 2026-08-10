using System.Text.Json;
using AuthService.Domain.Exceptions.Auth;
using AuthService.Domain.Exceptions.DataBase;
using AuthService.Domain.Exceptions.Services;

namespace AuthService.API.Middleware;

// Глобальний обробник: мапить доменні винятки на нормальні статуси (замість 500 на все).
// Стоїть ПІСЛЯ UseCors, тож на error-відповідях лишаються CORS-заголовки (інакше браузер бачить "Failed to fetch").
public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var (status, message) = Map(ex);

            if (status >= 500)
                _logger.LogError(ex, "Unhandled exception");
            else
                _logger.LogWarning("Handled {Type}: {Message}", ex.GetType().Name, ex.Message);

            if (context.Response.HasStarted)
                throw;

            context.Response.StatusCode = status;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonSerializer.Serialize(new { message }));
        }
    }

    private static (int status, string message) Map(Exception ex) => ex switch
    {
        UserPasswordOrEmailInvalidException => (401, "Невірний логін або пароль."),
        UserAlreadyExistsException          => (409, "Користувач з таким email вже існує."),
        UserSoftDeletedException            => (401, "Обліковий запис недоступний."),
        SessionValidationException          => (401, "Сесія недійсна. Увійдіть знову."),
        IncompleteHttpCookieDatasetException => (400, "Некоректний запит."),
        DataExistenceException              => (500, "Помилка конфігурації сервера (нема потрібних даних)."),
        _                                    => (500, "Внутрішня помилка сервера.")
    };
}
