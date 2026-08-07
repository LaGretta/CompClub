using AuthService.API.Controllers;
using AuthService.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddAuthService(builder.Configuration);//DI
builder.Services.AddAuthentication(builder.Configuration);//Jwt
builder.Services.AddRequestValidators();//Request`s validators
builder.Services.AddForwardedHeadersMiddleware();//Forwarded Headers Middleware

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseForwardedHeaders();//Forwarded Headers Middleware

app.UseTestEndpoints();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();