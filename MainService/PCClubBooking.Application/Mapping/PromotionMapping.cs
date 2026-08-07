using AutoMapper;
using PCClubBooking.Application.DTOs;
using PCClubBooking.Domain.Entities;

namespace PCClubBooking.Application.Mapping;

public class PromotionMapping : Profile
{
    public PromotionMapping()
    {
        CreateMap<CreatePromotionDto , Promotion>();
        CreateMap<UpdatePromotionDto , Promotion>();
        CreateMap<Promotion , PromotionResponseDto>();
    }
}