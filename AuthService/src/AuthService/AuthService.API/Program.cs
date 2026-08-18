using AuthService.API.Controllers;
using AuthService.Api;
using AuthService.Domain.Models;
using AuthService.Storage;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
//CORS property
const string frontendCors = "frontend";

builder.Services.AddControllers();
//DI
builder.Services.AddAuthService(builder.Configuration);//Main
builder.Services.AddAuthentication(builder.Configuration);//Jwt
builder.Services.AddRequestValidators();//Request`s validators
builder.Services.AddForwardedHeadersMiddleware();//Forwarded Headers Middleware
builder.Services.AddOptions(builder.Configuration);
builder.Services.AddAws(builder.Configuration);
builder.Services.AddDbContext(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCorsPolicy(builder.Configuration, frontendCors);

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

app.UseHttpsRedirection();

app.UseCors(frontendCors);

app.UseMiddleware<AuthService.API.Middleware.ExceptionHandlingMiddleware>();

//app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
