using System.Text;
using Amazon.S3;
using AuthService.Api.Validators;
using AuthService.Application.Services;
using AuthService.Application.Services.Abstractions;
using AuthService.Domain.DTOs.Options;
using AuthService.Domain.DTOs.Options.Cache;
using AuthService.Shared.Abstractions;
using AuthService.Storage;
using AuthService.Storage.Interceptors;
using AuthService.Storage.Repositories;
using AuthService.Storage.Repositories.Abstractions;
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
        //Manually services registration
        services.AddScoped<IUnitOfWork>(s => s.GetRequiredService<AuthServiceContext>());
        services.AddScoped<IAuthService, Application.Services.AuthService>();
        services.AddScoped<IAuthRepository, AuthRepository>();
        services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
        services.AddScoped<IMemoryCacheService, MemoryCacheService>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IRefreshTokenService, RefreshTokenService>();
        services.AddScoped<IHttpCookieService, HttpCookieService>();
        services.AddScoped<IUserAvatarStorage, UserAvatarStorage>();
        //Avatar management
        services.AddScoped<IUserAvatarStorage, UserAvatarStorage>();
        services.AddScoped<IFileTypeDetector, FileTypeDetector>();
        //packages
        services.AddMemoryCache(); //Cache
        //Auto services registration
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
    public static IServiceCollection AddDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<AuditInterceptor>(); //AuditInterceptor(Ef core)
        //Ef core
        services.AddDbContext<AuthServiceContext>((provider, options) =>
            {
                //DB (PostgresSQL — Railway)
                options.UseNpgsql(
                    configuration.GetConnectionString("DefaultConnection"),
                    npgsqlOptions =>
                    {
                        npgsqlOptions.MigrationsHistoryTable(
                            "__EFMigrationsHistory",
                            "auth");
                    });
                //AuditInterceptor
                options.AddInterceptors(
                    provider.GetRequiredService<AuditInterceptor>());
            }
        );

        return services;
    }
    public static IServiceCollection AddOptions(this IServiceCollection services, IConfiguration configuration)
    {
        //options(appsettings.json->Dto->services)
        services.Configure<JwtOptions>(configuration.GetSection("Jwt")); //Jwt
        services.Configure<SessionOptions>(configuration.GetSection("Session")); //Session
        services.Configure<AvatarOptions>(configuration.GetSection("AvatarOptions"));//Avatar
        services.Configure<S3Options>(options =>
        {
            options.BucketName = configuration["AWS_BUCKET_NAME"] ?? throw new InvalidOperationException("AWS_BUCKET_NAME is not configured.");
        });//AWS-> S3 -> Bucket name
        services.Configure<CacheOptions>(configuration.GetSection("Cache")); //Cache
        
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
        services.AddValidatorsFromAssemblyContaining<AvatarUploadValidator>();
        services.AddValidatorsFromAssemblyContaining<TransactionExecuteValidator>();

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
    public static IServiceCollection AddAws(this IServiceCollection services, IConfiguration configuration )
    {
        services.AddDefaultAWSOptions(configuration.GetAWSOptions());
        services.AddAWSService<IAmazonS3>();

        return services;
    }
    public static IServiceCollection AddCorsPolicy(this IServiceCollection services, IConfiguration configuration, string frontendCors)
    {
        services.AddCors(options =>
        {
            var origins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                          ?? new[] { "http://localhost:5173", "https://compclub-production.up.railway.app" };
            options.AddPolicy(frontendCors, policy => policy
                .WithOrigins(origins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials());
        });
        return services;
    }
}
