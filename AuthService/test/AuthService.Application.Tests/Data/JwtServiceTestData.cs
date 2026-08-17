using System.Collections;
using AuthService.Domain.DTOs.Jwt;
using Xunit;

namespace AuthService.Application.Tests.Data;


public class JwtServiceTestData : TheoryData<JwtTokenRequest>
{
    public JwtServiceTestData()
    {
        Add(new JwtTokenRequest
        {
            UserId = Guid.Parse("8f395610-c081-427c-9b16-5e0dddf5b5e3"),
            UserName = "TestUser-1",
            Email = "testUser1213@gmail.com",
            RoleNames = ["Customer"]
        });
    }
}

