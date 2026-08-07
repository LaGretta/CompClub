using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PCClubBooking.Application.Interfaces;
using PCClubBooking.Application.Interfaces.Repository;
using PCClubBooking.Infrastructure.Data;
using PCClubBooking.Infrastructure.Repositories;

namespace PCClubBooking.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IComputerRepository, ComputerRepository>();
        services.AddScoped<IBookingRepository, BookingRepository>();
        services.AddScoped<IDeviceRepository, DeviceRepository>();
        services.AddScoped<IPromotionRepository, PromotionRepository>();

        services.AddScoped<IUnitOfWork, UnitOfWork.UnitOfWork>();

        return services;
    }
}