using PCClubBooking.Application.DTOs;

namespace PCClubBooking.Application.Interfaces.Service;

public interface IComputerService
{
    Task<List<ComputerResponseDto>> GetAllComputers(CancellationToken ct);
    Task<ComputerResponseDto?> GetComputerById(int id , CancellationToken ct);
    Task<List<ComputerResponseDto>> GetAvailableComputers(DateTime start, DateTime end , CancellationToken ct);
    Task CreateComputer(CreateComputerDto createComputerDto ,  CancellationToken ct);
    Task UpdateComputerById(UpdateComputerDto updateComputerDto , int id , CancellationToken ct);
    Task DeleteComputerById(int id , CancellationToken ct);
}