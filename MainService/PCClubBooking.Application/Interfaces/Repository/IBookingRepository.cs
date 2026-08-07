using PCClubBooking.Domain.Entities;

namespace PCClubBooking.Application.Interfaces.Repository;

public interface IBookingRepository
{
    Task CreateBooking(Booking booking , CancellationToken ct);
    Task<List<Booking>> GetMyBooking(int userId , CancellationToken ct);
    Task<Booking?> GetBookingById(int bookingId , CancellationToken ct);
    Task<Booking?> GetMyBookingById(int userId ,int bookingId , CancellationToken ct);
    
    Task<bool> HasOverlappingBookingAsync(int computerId, DateTime start, DateTime end , CancellationToken ct);
    Task<(List<Booking> Items, int TotalCount)> GetAllPagedAsync(int page, int pageSize , CancellationToken ct);
}