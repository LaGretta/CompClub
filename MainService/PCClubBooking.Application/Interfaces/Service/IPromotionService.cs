using PCClubBooking.Application.DTOs;

namespace PCClubBooking.Application.Interfaces.Service;

public interface IPromotionService
{
    Task<List<PromotionResponseDto>> GetAllPromotions(CancellationToken ct);
    Task<PromotionResponseDto?> GetPromotionById(int id , CancellationToken ct);
    Task CreatePromotion(CreatePromotionDto createPromotionDto , CancellationToken ct);
    Task UpdatePromotionById(UpdatePromotionDto updatePromotionDto , int id , CancellationToken ct);
    Task DeletePromotionById(int id , CancellationToken ct);
}