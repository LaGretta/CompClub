using AuthService.Domain.DTOs.Jwt;

namespace AuthService.Application.Services.Abstractions;

public interface IJwtService
{
    string GenerateToken(JwtTokenRequest request);
}