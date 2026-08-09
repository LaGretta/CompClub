using PCClubBooking.Application.DTOs;

namespace PCClubBooking.Application.Interfaces.Service;

public interface IBookingService
{
    Task<ResponseBookingDto> CreateBooking(CreateBookingDto createBookingDto, Guid userId , CancellationToken ct);
    Task<List<ResponseBookingDto>> GetAllMyBookings(Guid userId , CancellationToken ct);
    Task<ResponseBookingDto> GetBookingById(int bookingId , Guid userId , CancellationToken ct);
    Task<ResponseBookingDto> CancelBooking(int bookingId , Guid userId , CancellationToken ct);
    Task<PagedResponse<ResponseBookingDto>> GetAllBookings(int page, int pageSize , CancellationToken ct);
}