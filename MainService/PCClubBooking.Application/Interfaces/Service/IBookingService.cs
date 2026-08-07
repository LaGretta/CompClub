using PCClubBooking.Application.DTOs;

namespace PCClubBooking.Application.Interfaces.Service;

public interface IBookingService
{
    Task<ResponseBookingDto> CreateBooking(CreateBookingDto createBookingDto, int userId , CancellationToken ct);
    Task<List<ResponseBookingDto>> GetAllMyBookings(int userId , CancellationToken ct);
    Task<ResponseBookingDto> GetBookingById(int bookingId , int userId , CancellationToken ct);
    Task<ResponseBookingDto> CancelBooking(int bookingId , int userId , CancellationToken ct);
    Task<PagedResponse<ResponseBookingDto>> GetAllBookings(int page, int pageSize , CancellationToken ct);
}