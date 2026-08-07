using AutoMapper;
using PCClubBooking.Application.DTOs;
using PCClubBooking.Domain.Entities;

namespace PCClubBooking.Application.Mapping;

public class DeviceMapping  : Profile
{
    public DeviceMapping()
    {
        CreateMap<CreateDeviceDto , Device>();
        CreateMap<UpdateDeviceDto , Device>();
        CreateMap<Device, DeviceResponseDto>();
    }
}