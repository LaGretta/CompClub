using PCClubBooking.Domain.Entities;

namespace PCClubBooking.Application.Interfaces.Repository;

public interface IPromotionRepository
{
    Task<List<Promotion>> GetAllPromotionsAsync(CancellationToken ct);
    Task<Promotion?> GetPromotionByIdAsync(int id , CancellationToken ct);
    Task CreatePromotionAsync(Promotion promotion , CancellationToken ct);
    Task UpdatePromotionAsync(Promotion promotion);
    void DeletePromotionById(Promotion promotion);
}