using System.Reflection;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using PCClubBooking.Application.Interfaces.Service;
using PCClubBooking.Application.Service;

namespace PCClubBooking.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(cfg => cfg.AddMaps(Assembly.GetExecutingAssembly()));
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddScoped<IBookingService, BookingService>();
        services.AddScoped<IComputerService, ComputerService>();
        services.AddScoped<IDeviceService, DeviceService>();
        services.AddScoped<IPromotionService, PromotionService>();

        return services;
    }
}