using AutoMapper;
using PCClubBooking.Application.DTOs;
using PCClubBooking.Application.Interfaces;
using PCClubBooking.Application.Interfaces.Repository;
using PCClubBooking.Application.Interfaces.Service;
using PCClubBooking.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace PCClubBooking.Application.Service;

public class DeviceService : IDeviceService
{
    private readonly IDeviceRepository _deviceRepository;
    private readonly IComputerRepository _computerRepository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DeviceService> _logger;

    public DeviceService(IDeviceRepository deviceRepository
        , IMapper mapper
        , IUnitOfWork unitOfWork
        , IComputerRepository computerRepository
        , ILogger<DeviceService> logger)
    {
        _deviceRepository = deviceRepository;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _computerRepository = computerRepository;
        _logger = logger;
    }
    public async Task<List<DeviceResponseDto>> GetDevicesByComputerId(int computerId , CancellationToken ct)
    {
        var find = await _computerRepository.GetComputerById(computerId , ct);
        if (find == null)
            throw new KeyNotFoundException("Computer not found");
        return _mapper.Map<List<DeviceResponseDto>>(find.Devices);
    }
    public async Task AddDeviceToPc(CreateDeviceDto createDeviceDto, int computerId , CancellationToken ct)
    {
        var findPc = await _computerRepository.GetComputerById(computerId , ct);
        if(findPc == null)
            throw new KeyNotFoundException("Computer not found");
        var add = _mapper.Map<Device>(createDeviceDto);
        findPc.Devices.Add(add);
        await _computerRepository.UpdateComputer(findPc);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Device added to computer {ComputerId}", computerId);
    }
    public async Task UpdateDeviceById(UpdateDeviceDto updateDeviceDto, int id , CancellationToken ct)
    {
        var device = await _deviceRepository.GetDeviceById(id ,ct); 
        if (device == null)
            throw new KeyNotFoundException("Device not found");
        _mapper.Map(updateDeviceDto, device);                     
        await _deviceRepository.UpdateDevice(device);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Device updated: {DeviceId}", id);
    }
    public async Task DeleteDeviceFromPc(int id , CancellationToken ct)
    {
        var device = await _deviceRepository.GetDeviceById(id ,ct);   
        if (device == null)                                       
            throw new KeyNotFoundException("Device not found");
        _deviceRepository.DeleteDevice(device);                
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogWarning("Device deleted: {DeviceId}", id);
    }
}