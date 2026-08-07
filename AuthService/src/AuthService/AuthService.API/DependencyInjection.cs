using System.Text;
using AuthService.Api.Validators;
using AuthService.Application.Services.Abstractions;
using AuthService.Domain.DTOs.Options;
using AuthService.Domain.DTOs.Options.Cache;
using AuthService.Storage;
using AuthService.Storage.Interceptors;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SessionOptions = Microsoft.AspNetCore.Builder.SessionOptions;

namespace AuthService.Api;

public static class DependencyInjection
{
    public static IServiceCollection AddAuthService(this IServiceCollection services, IConfiguration configuration)
    {
        //options(appsettings.json->Dto->services)
        services.Configure<JwtOptions>(configuration.GetSection("Jwt")); //Jwt
        services.Configure<SessionOptions>(configuration.GetSection("Session"));//Session
        services.Configure<CacheOptions>(configuration.GetSection("Cache"));//Cache
        //Manually services registration
        services.AddScoped<IUnitOfWork>(s => s.GetRequiredService<AuthServiceContext>());
        services.AddScoped<IAuthService>(s => s.GetRequiredService<Application.Services.AuthService>());
        //
        
        //packages
        services.AddMemoryCache();//Cache
        //other
        services.AddSingleton<AuditInterceptor>();//AuditInterceptor(Ef core)
        //Ef core
        services.AddDbContext<AuthServiceContext>((provider, options) =>
            {
                //DB
                options.UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection")
                );
                //AuditInterceptor
                options.AddInterceptors(
                    provider.GetRequiredService<AuditInterceptor>());
            }
        );
        //Auto services registration(in progress)
        // services.Scan(scan => scan
        //     .FromAssembliesOf(
        //         typeof(RecruitmentVacanciesContext),
        //         typeof(AuthService)
        //     )
        //     .AddClasses(c => c.Where(t => t.Name.EndsWith("Repository", StringComparison.Ordinal)))
        //     .AsImplementedInterfaces()
        //     .WithScopedLifetime()
        //     
        //     .AddClasses(c => c.Where(t =>
        //         t.Name.EndsWith("Service", StringComparison.Ordinal) &&
        //         t != typeof(StatusHostedService)))
        //     .AsSelf()
        //     .WithScopedLifetime());
        // //
        // services.AddTransient<IJwtService, JwtService>();
        
        return services;
    }

    public static IServiceCollection AddMemoryCache(this IServiceCollection services)
    {
        services.AddMemoryCache(options =>
        {
            options.SizeLimit = 1024; //total allowed size units
            options.CompactionPercentage = 0.20; //removes 20% of elements when full
            options.ExpirationScanFrequency = TimeSpan.FromMinutes(5); //cleanup interval
        });
        
        return services;
    }

    public static IServiceCollection AddAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtOptions = configuration.GetSection("Jwt").Get<JwtOptions>() ?? throw new InvalidOperationException("Jwt configuration is missing.");
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer =jwtOptions.Issuer,
    
                    ValidateAudience = true,
                    ValidAudience = jwtOptions.Audience,
    
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtOptions.SecretKey)),
                    
                    ValidateLifetime = false
                };
            });
        return services;
    }
    public static IServiceCollection AddRequestValidators(this IServiceCollection services)
    {
        services.AddValidatorsFromAssemblyContaining<LoginUserRequestValidator>();
        services.AddValidatorsFromAssemblyContaining<RegisterUserRequestValidator>();

        return services;
    }

    public static IServiceCollection AddForwardedHeadersMiddleware(this IServiceCollection services)
    {
        services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            // Для тестів можна очистити.
            // Для production краще вказати KnownNetworks/KnownProxies.
            options.KnownNetworks.Clear();
            options.KnownProxies.Clear();
        });
        return services;
    }
}