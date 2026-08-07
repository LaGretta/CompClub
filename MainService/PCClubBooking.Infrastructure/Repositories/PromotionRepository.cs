using Microsoft.EntityFrameworkCore;
using PCClubBooking.Application.Interfaces.Repository;
using PCClubBooking.Domain.Entities;
using PCClubBooking.Infrastructure.Data;

namespace PCClubBooking.Infrastructure.Repositories;

public class PromotionRepository : IPromotionRepository
{
    private readonly AppDbContext _dbContext;
    public PromotionRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<List<Promotion>> GetAllPromotionsAsync(CancellationToken ct)
        => await _dbContext.Promotions.ToListAsync(ct);
    
    public async Task<Promotion?> GetPromotionByIdAsync(int id , CancellationToken ct)
    {
         var find = await  _dbContext.Promotions.FirstOrDefaultAsync(p => p.Id == id , ct);
         return find;
    }
    public async Task CreatePromotionAsync(Promotion promotion , CancellationToken ct)
    {
         await _dbContext.Promotions.AddAsync(promotion ,ct);
    }
    public Task UpdatePromotionAsync(Promotion promotion)
    {
        _dbContext.Update(promotion);
        return Task.CompletedTask;
    }
    public void DeletePromotionById(Promotion promotion)
    {
        _dbContext.Remove(promotion);
    }
}