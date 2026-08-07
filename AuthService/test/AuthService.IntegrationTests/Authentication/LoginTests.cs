using AuthService.Application.Tests.Data;
using AuthService.Domain.DTOs.Jwt;
using Xunit;

namespace AuthService.IntegrationTests.Authentication;

public class LoginTests
{
    [Theory]
    [ClassData(typeof(JwtServiceTestData))]
    public void GenerateToken_ShouldCreateValidJwt(JwtTokenRequest request)
    {
    }
}