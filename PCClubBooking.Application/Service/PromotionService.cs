using AutoMapper;
using PCClubBooking.Application.DTOs;
using PCClubBooking.Application.Interfaces;
using PCClubBooking.Application.Interfaces.Repository;
using PCClubBooking.Application.Interfaces.Service;
using PCClubBooking.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace PCClubBooking.Application.Service;

public class PromotionService : IPromotionService
{
    private readonly IPromotionRepository _promotionRepository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<PromotionService> _logger;

    public PromotionService(IPromotionRepository promotionRepository
        , IMapper mapper
        , IUnitOfWork unitOfWork
        , ILogger<PromotionService> logger)
    {
        _promotionRepository = promotionRepository;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<List<PromotionResponseDto>> GetAllPromotions(CancellationToken ct)
    {
        var all = await _promotionRepository.GetAllPromotionsAsync(ct);
        return _mapper.Map<List<PromotionResponseDto>>(all);
    }
    public async Task<PromotionResponseDto?> GetPromotionById(int id , CancellationToken ct)
    {
        var find = await  _promotionRepository.GetPromotionByIdAsync(id , ct);
        if (find == null)
            throw new KeyNotFoundException($"Promotion with id {id} not found");
        return _mapper.Map<PromotionResponseDto>(find);
    }
    public async Task CreatePromotion(CreatePromotionDto createPromotionDto , CancellationToken ct)
    {
        var promotion = _mapper.Map<Promotion>(createPromotionDto);
        await _promotionRepository.CreatePromotionAsync(promotion , ct);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Promotion created: {PromotionId}", promotion.Id);
    }
    public async Task UpdatePromotionById(UpdatePromotionDto updatePromotionDto, int id , CancellationToken ct)
    {
        var find = await _promotionRepository.GetPromotionByIdAsync(id , ct);
        if (find == null)
            throw new KeyNotFoundException($"Promotion with id {id} not found");
        _mapper.Map(updatePromotionDto, find);
        await _promotionRepository.UpdatePromotionAsync(find);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Promotion updated: {PromotionId}", id);
    }
    public async Task DeletePromotionById(int id , CancellationToken ct)
    {
        var find = await _promotionRepository.GetPromotionByIdAsync(id , ct);
        if (find == null)
            throw new KeyNotFoundException($"Promotion with id {id} not found");
        _promotionRepository.DeletePromotionById(find);
        await _unitOfWork.SaveChangesAsync(ct); 
        _logger.LogWarning("Promotion deleted: {PromotionId}", id);
    }
}