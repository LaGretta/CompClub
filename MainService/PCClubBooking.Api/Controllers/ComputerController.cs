using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCClubBooking.Application.Common;
using PCClubBooking.Application.DTOs;
using PCClubBooking.Application.Interfaces.Repository;
using PCClubBooking.Application.Interfaces.Service;

namespace PCClubBooking.Api.Controllers;

[ApiController]
[Route("api/computers")]
public class ComputerController : ControllerBase
{
   private readonly  IComputerService _service;
   public ComputerController(IComputerService service)
   {
       _service = service;
   }

   [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var computers = await _service.GetAllComputers(ct);
        return Ok(computers);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id , CancellationToken ct)
    {
        var computer = await _service.GetComputerById(id , ct);
        return Ok(computer);
    }

    [HttpGet("available")]
    public async Task<IActionResult> GetAvailable(CancellationToken ct ,[FromQuery] DateTime start, [FromQuery] DateTime end)
    {
        var computers = await _service.GetAvailableComputers(start, end , ct);
        return Ok(computers);
    }
    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Create([FromBody] CreateComputerDto dto , CancellationToken ct)
    {
        await _service.CreateComputer(dto , ct);
        return Ok();
    }
    [HttpPut("{id}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateComputerDto dto , CancellationToken ct)
    {
        await _service.UpdateComputerById(dto, id ,ct);
        return Ok();
    }
    [HttpDelete("{id}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete(int id , CancellationToken ct)
    {
        await _service.DeleteComputerById(id , ct);
        return NoContent();
    }
}