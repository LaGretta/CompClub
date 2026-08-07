using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCClubBooking.Application.Common;
using PCClubBooking.Application.DTOs;
using PCClubBooking.Application.Interfaces.Service;

namespace PCClubBooking.Api.Controllers;

[ApiController]
[Route("api/promotions")]
public class PromotionController : ControllerBase
{
    private readonly IPromotionService _promotionService;
    public PromotionController(IPromotionService promotionService)
    {
        _promotionService = promotionService;
    }
    [HttpGet]
    public async Task<IActionResult> GetAllPromotions(CancellationToken ct)
    {
        return Ok(await _promotionService.GetAllPromotions(ct));
    }
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id , CancellationToken ct)
    {
        var promotion = await _promotionService.GetPromotionById(id , ct);
        return Ok(promotion);
    }
    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Create([FromBody] CreatePromotionDto dto , CancellationToken ct)
    {
        await _promotionService.CreatePromotion(dto , ct);
        return Ok();
    }
    [HttpPut("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePromotionDto dto , CancellationToken ct)
    {
        await _promotionService.UpdatePromotionById(dto, id , ct);
        return Ok();
    }
    [HttpDelete("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete(int id , CancellationToken ct)
    {
        await _promotionService.DeletePromotionById(id , ct);
        return NoContent();
    }
}