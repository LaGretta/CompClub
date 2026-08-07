using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCClubBooking.Application.Common;
using PCClubBooking.Application.DTOs;
using PCClubBooking.Application.Interfaces.Service;

namespace PCClubBooking.Api.Controllers;

[ApiController]
[Route("api")]
public class DeviceController : ControllerBase
{
    private readonly IDeviceService _deviceService;

    public DeviceController(IDeviceService deviceService)
    {
        _deviceService = deviceService;
    }
    [HttpGet("computers/{computerId:int}/devices")]
    public async Task<IActionResult> GetByComputer(int computerId  , CancellationToken ct)
    {
        var devices = await _deviceService.GetDevicesByComputerId(computerId , ct);
        return Ok(devices);
    }

    [HttpPost("computers/{computerId:int}/devices")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Add(int computerId, [FromBody] CreateDeviceDto dto , CancellationToken ct)
    {
        await _deviceService.AddDeviceToPc(dto, computerId , ct);
        return Ok();
    }

    [HttpPut("devices/{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateDeviceDto dto , CancellationToken ct)
    {
        await _deviceService.UpdateDeviceById(dto, id ,ct);
        return Ok();
    }

    [HttpDelete("devices/{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete(int id , CancellationToken ct)
    {
        await _deviceService.DeleteDeviceFromPc(id , ct);
        return NoContent();
    }
}