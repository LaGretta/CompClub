using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using PCClubBooking.Api.Middleware;
using PCClubBooking.Application;
using PCClubBooking.Infrastructure;
using PCClubBooking.Infrastructure.Data;
using Serilog;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, config) =>
    config.ReadFrom.Configuration(context.Configuration));
// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();




// ---- JWT ВАЛІДАЦІЯ ----
//  TODO ДАНИЛО: підстав сюди свої значення з сервісу автентифікації.
// Мій сервіс лише ВАЛІДУЄ твій токен (не генерує). Потрібні:
//   1. Jwt:Key      — той самий секретний ключ яким ТИ підписуєш токен
//   2. Jwt:Issuer   — твій issuer
//   3. Jwt:Audience — твій audience
// Зараз стоять мої значення з appsettings.json — заміни на свої.

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });
//////////////////////////////////////////////////////////////////////////^



builder.Services.AddAuthorization();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();
app.UseSerilogRequestLogging();
app.UseExceptionHandler();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (db.Database.IsRelational())
        await db.Database.MigrateAsync();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();   

app.UseAuthorization();

app.MapControllers();

app.Run();
public partial class Program { }