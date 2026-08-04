using AutoMapper;
using PCClubBooking.Application.DTOs;
using PCClubBooking.Application.Interfaces;
using PCClubBooking.Application.Interfaces.Repository;
using PCClubBooking.Application.Interfaces.Service;
using PCClubBooking.Domain.Entities;
using Microsoft.Extensions.Logging;  


namespace PCClubBooking.Application.Service;

public class ComputerService : IComputerService
{
    private readonly IMapper _mapper;
    private readonly IComputerRepository _computerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ComputerService> _logger;  


    public ComputerService(IMapper mapper
        , IComputerRepository computerRepository
        , IUnitOfWork unitOfWork
        , ILogger<ComputerService> logger)
    {
        _mapper = mapper;
        _computerRepository = computerRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<List<ComputerResponseDto>> GetAllComputers(CancellationToken ct)
    {
         var find = await _computerRepository.GetAllComputers(ct);
         return _mapper.Map<List<ComputerResponseDto>>(find);
    }
    public async Task<ComputerResponseDto?> GetComputerById(int id , CancellationToken ct)
    {
         var get = await _computerRepository.GetComputerById(id ,ct);
         if(get == null)
             throw new KeyNotFoundException("Computer not found");
         return _mapper.Map<ComputerResponseDto>(get);
    }
    public async Task<List<ComputerResponseDto>> GetAvailableComputers(DateTime start, DateTime end , CancellationToken ct)
    {
         var computers = await _computerRepository.GetAvailableComputers(start, end , ct); 
         return _mapper.Map<List<ComputerResponseDto>>(computers);
    }
    public async Task CreateComputer(CreateComputerDto createComputerDto , CancellationToken ct)
    {
        var computer = _mapper.Map<Computer>(createComputerDto);
        await _computerRepository.CreateComputer(computer , ct);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Computer created: {ComputerId}", computer.Id);   
    }
    public async Task UpdateComputerById(UpdateComputerDto updateComputerDto, int id , CancellationToken ct)
    {
        var findpc = await _computerRepository.GetComputerById(id , ct);
        if(findpc == null)
            throw new KeyNotFoundException("Computer not found");
        _mapper.Map(updateComputerDto, findpc);
        await _computerRepository.UpdateComputer(findpc);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Computer updated: {ComputerId}", id);  
    }
    public async Task DeleteComputerById(int id , CancellationToken ct)
    {
         var findpc = await _computerRepository.GetComputerById(id , ct);
         if (findpc == null)
             throw new KeyNotFoundException("Computer not found");
         _computerRepository.DeleteComputer(findpc);
         await _unitOfWork.SaveChangesAsync(ct);
         _logger.LogWarning("Computer deleted: {ComputerId}", id);  
    }
}