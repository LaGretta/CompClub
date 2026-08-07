using AutoMapper;
using PCClubBooking.Application.DTOs;
using PCClubBooking.Domain.Entities;

namespace PCClubBooking.Application.Mapping;

public class ComputerMapping : Profile
{
    public ComputerMapping()
    {
        CreateMap<CreateComputerDto, Computer>();
        CreateMap<UpdateComputerDto, Computer>();
        CreateMap<Computer, ComputerResponseDto>();
    }
}