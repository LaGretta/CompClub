using AuthService.API.Controllers;
using AuthService.Api;
using AuthService.Domain.Models;
using AuthService.Storage;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddAuthService(builder.Configuration);//DI
builder.Services.AddAuthentication(builder.Configuration);//Jwt
builder.Services.AddRequestValidators();//Request`s validators
builder.Services.AddForwardedHeadersMiddleware();//Forwarded Headers Middleware

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS для фронта (браузер шле логін/реєстрацію крос-доменно з credentials).
// Origins задаються в конфізі Cors:AllowedOrigins; є дефолти для локалки + Railway-фронта.
const string FrontendCors = "frontend";
builder.Services.AddCors(options =>
{
    var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
        ?? new[] { "http://localhost:5173", "https://compclub-production.up.railway.app" };
    options.AddPolicy(FrontendCors, policy => policy
        .WithOrigins(origins)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AuthServiceContext>();

    if (db.Database.IsRelational())
    {
        await db.Database.MigrateAsync();
    }

    foreach (var roleName in new[] { "Client", "Admin" })
    {
        if (!await db.Roles.AnyAsync(r => r.Name == roleName))
        {
            db.Roles.Add(new Role
            {
                Name = roleName
            });
        }
    }

    await db.SaveChangesAsync();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseForwardedHeaders();//Forwarded Headers Middleware

app.UseTestEndpoints();

app.UseHttpsRedirection();

app.UseCors(FrontendCors);

// Після UseCors — щоб на error-відповідях лишались CORS-заголовки.
app.UseMiddleware<AuthService.API.Middleware.ExceptionHandlingMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();
