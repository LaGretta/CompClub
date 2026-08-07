using PCClubBooking.Domain.Entities;

namespace PCClubBooking.Application.Interfaces.Repository;

public interface IDeviceRepository
{
    Task<List<Device>> GetDevicesByComputerId(int computerId , CancellationToken ct);  
    Task<Device?> GetDeviceById(int id , CancellationToken ct);                          
    Task AddDevice(Device device , CancellationToken ct);
    Task UpdateDevice(Device device);
    void DeleteDevice(Device device);
}