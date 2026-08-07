using Microsoft.EntityFrameworkCore;
using PCClubBooking.Application.Interfaces.Repository;
using PCClubBooking.Domain.Entities;
using PCClubBooking.Domain.Enums;
using PCClubBooking.Infrastructure.Data;

namespace PCClubBooking.Infrastructure.Repositories;

public class ComputerRepository : IComputerRepository
{
    private readonly AppDbContext _dbContext;

    public ComputerRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Computer>> GetAllComputers(CancellationToken ct)
        => await _dbContext.Computers.ToListAsync(ct);
    
    public async Task<Computer?> GetComputerById(int id , CancellationToken ct)
    {
        return await _dbContext.Computers
            .Include(c => c.Devices)                    
            .FirstOrDefaultAsync(c => c.Id == id , ct);
    }

    public async Task<List<Computer>> GetAvailableComputers(DateTime start, DateTime end , CancellationToken ct )
    {
        return await _dbContext.Computers               
            .Where(c => c.IsWorking)                        
            .Where(c => !_dbContext.Bookings.Any(b =>          
                b.ComputerId == c.Id
                && b.Status == BookingStatus.Active
                && b.StartTime < end
                && b.EndTime > start))                         
            .ToListAsync(ct);
    }
    public async Task CreateComputer(Computer computer , CancellationToken ct)
    {
         await _dbContext.Computers.AddAsync(computer , ct);
    }
    public Task UpdateComputer(Computer computer)
    {
        _dbContext.Update(computer);
        return Task.CompletedTask;
    }
    public void DeleteComputer(Computer computer)
    {
        _dbContext.Remove(computer);
    }
}