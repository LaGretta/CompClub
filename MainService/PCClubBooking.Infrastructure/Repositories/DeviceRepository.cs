using Microsoft.EntityFrameworkCore;
using PCClubBooking.Application.Interfaces;
using PCClubBooking.Application.Interfaces.Repository;
using PCClubBooking.Domain.Entities;
using PCClubBooking.Infrastructure.Data;

namespace PCClubBooking.Infrastructure.Repositories;

public class DeviceRepository : IDeviceRepository
{
    private readonly AppDbContext _dbContext;
    public DeviceRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<List<Device>> GetDevicesByComputerId(int computerId , CancellationToken ct)
        => await _dbContext.Devices.Where(n => n.ComputerId == computerId ).ToListAsync(ct);
    
    public async Task<Device?> GetDeviceById(int id , CancellationToken ct)
    {
        var find = await _dbContext.Devices.FirstOrDefaultAsync(n => n.Id == id ,ct );
        return find;
    }
    public async Task AddDevice(Device device , CancellationToken ct)
    {
         await _dbContext.AddAsync(device ,ct);
    }
    public Task UpdateDevice(Device device)
    {
        _dbContext.Update(device);          
        return Task.CompletedTask;
    }
    public void DeleteDevice(Device device)
    {
         _dbContext.Remove(device);
    }
}