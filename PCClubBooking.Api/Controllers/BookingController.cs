using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCClubBooking.Application.DTOs;
using PCClubBooking.Application.Interfaces.Service;
using PCClubBooking.Application.Common;

namespace PCClubBooking.Api.Controllers;

[ApiController]
[Route("api/bookings")]
[Authorize] 
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }
    private int GetUserId()
        => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingDto dto , CancellationToken ct)
    {
        var userId = GetUserId();
        var booking = await _bookingService.CreateBooking(dto, userId , ct);
        return Ok(booking);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMy(CancellationToken ct)
    {
        var userId = GetUserId();
        var bookings = await _bookingService.GetAllMyBookings(userId , ct);
        return Ok(bookings);
    }
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var booking = await _bookingService.GetBookingById(id, userId, ct);
        return Ok(booking);
    }

    [HttpPost("{id:int}/cancel")]
    public async Task<IActionResult> Cancel(int id , CancellationToken ct)
    {
        var userId = GetUserId();
        var booking = await _bookingService.CancelBooking(id, userId , ct);
        return Ok(booking);
    }

    [HttpGet]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> GetAll(CancellationToken ct, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _bookingService.GetAllBookings(page, pageSize ,  ct);
        return Ok(result);
    }
}