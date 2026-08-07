using AutoMapper;
using PCClubBooking.Application.DTOs;
using PCClubBooking.Domain.Entities;

namespace PCClubBooking.Application.Mapping;

public class BookingMapping : Profile
{
    public BookingMapping()
    {
        CreateMap<CreateBookingDto , Booking>();
        CreateMap<Booking, ResponseBookingDto>();
    }
}