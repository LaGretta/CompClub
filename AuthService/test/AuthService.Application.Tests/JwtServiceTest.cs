using System.IdentityModel.Tokens.Jwt;
using AuthService.Application.Services;
using AuthService.Domain.DTOs.Jwt;
using AuthService.Domain.DTOs.Options;
using Microsoft.Extensions.Options;
using Xunit;
using AuthService.Application.Tests.Data;
namespace AuthService.Application.Tests;

public class JwtServiceTest
{
    [Theory]
    [ClassData(typeof(JwtServiceTestData))]
    public void GenerateToken_ShouldCreateValidJwt(JwtTokenRequest request)
    {
        var options = Options.Create(new JwtOptions
        {
            SecretKey = "ThisIsVeryLongSecretKeyForJwtTests123456789",
            Issuer = "TestIssuer",
            Audience = "TestAudience",
            ExpirationMinutes = 30
        });

        var service = new JwtService(options);

        var token = service.GenerateToken(request);

        Assert.NotNull(token);
        Assert.NotEmpty(token);

        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        Assert.Equal("TestIssuer", jwt.Issuer);

        Assert.Contains(jwt.Claims,
            c => c.Type == JwtRegisteredClaimNames.Email &&
                 c.Value == request.Email);
    }
}