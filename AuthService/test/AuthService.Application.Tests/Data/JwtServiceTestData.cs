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
            RoleIds =
            [
                Guid.Parse("4e90bb53-8cd0-4db1-b94d-52b558b5a4df"),
                Guid.Parse("cb5b320f-0a0c-4df0-b775-954bf7e480a5")
            ]
        });
    }
}

