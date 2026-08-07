using PCClubBooking.Application.DTOs;

namespace PCClubBooking.Application.Interfaces.Service;

public interface IDeviceService
{
    Task<List<DeviceResponseDto>> GetDevicesByComputerId(int computerId , CancellationToken ct);
    Task AddDeviceToPc(CreateDeviceDto createDeviceDto, int computerId , CancellationToken ct);
    Task UpdateDeviceById(UpdateDeviceDto updateDeviceDto , int id , CancellationToken ct);
    Task DeleteDeviceFromPc(int id , CancellationToken ct);
}