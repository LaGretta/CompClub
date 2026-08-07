using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthService.Domain.DTOs.Jwt;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using AuthService.Application.Services.Abstractions;
using AuthService.Domain.DTOs.Options;

namespace AuthService.Application.Services;

public class JwtService: IJwtService
{
    private readonly JwtOptions _options;
    
    public JwtService(IOptions<JwtOptions> options)
    {
        _options = options.Value;
    }
    
    public string GenerateToken(JwtTokenRequest request)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_options.SecretKey));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>()
        {
            new (JwtRegisteredClaimNames.Sub, request.UserId.ToString()),
            new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

            new (JwtRegisteredClaimNames.Email, request.Email),
            new (JwtRegisteredClaimNames.UniqueName, request.UserName)
        };

        claims.AddRange(request.RoleIds.Select(r => new Claim(ClaimTypes.Role, r.ToString())));

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddMinutes(_options.ExpirationMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}