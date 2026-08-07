using System.Net;
using FluentAssertions;
using PCClubBooking.Application.DTOs;
using PCClubBooking.Domain.Enums;


namespace PCClubBooking.Tests.Integration;

public class ComputerApiTests : IClassFixture<CustomWebAppFactory>
{
    private readonly HttpClient _client;

    public ComputerApiTests(CustomWebAppFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAllComputers_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/computers");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task CreateComputer_WithoutAuth_ReturnsUnauthorized()
    {
        var dto = new CreateComputerDto
        {
            Name = "Test Computer",
            Category = ComputerCategory.Standard,
            PricePerHour = 50
        };
        var response = await _client.PostAsJsonAsync("/api/computers", dto);
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
  
    
}