using PCClubBooking.Domain.Entities;

namespace PCClubBooking.Application.Interfaces.Repository;

public interface IComputerRepository
{
    Task<List<Computer>> GetAllComputers(CancellationToken ct);
    Task<Computer?> GetComputerById(int id , CancellationToken ct);
    Task<List<Computer>> GetAvailableComputers(DateTime start, DateTime end , CancellationToken ct);
    Task CreateComputer(Computer computer , CancellationToken ct);
    Task UpdateComputer(Computer computer);
    void DeleteComputer(Computer computer);
}