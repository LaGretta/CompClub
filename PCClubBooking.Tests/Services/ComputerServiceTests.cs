using AutoMapper;
using FluentAssertions;
using Moq;
using PCClubBooking.Application.DTOs;
using PCClubBooking.Application.Interfaces;
using PCClubBooking.Application.Interfaces.Repository;
using PCClubBooking.Application.Interfaces.Service;
using PCClubBooking.Application.Service;
using PCClubBooking.Domain.Entities;
using PCClubBooking.Domain.Enums;

namespace PCClubBooking.Tests.Services;

public class ComputerServiceTests
{
    private readonly Mock<IComputerRepository> _computerRepository;
    private readonly Mock<IMapper> _mapper;
    private readonly Mock<IUnitOfWork> _unitOfWork;
    private readonly Mock<ILogger<ComputerService>> _logger;  
    private readonly IComputerService _computerService;

    public ComputerServiceTests()
    {
        _computerRepository = new Mock<IComputerRepository>();
        _mapper = new Mock<IMapper>();
        _unitOfWork = new Mock<IUnitOfWork>();
        _logger = new Mock<ILogger<ComputerService>>();  

        _computerService = new ComputerService(
            _mapper.Object,
            _computerRepository.Object,
            _unitOfWork.Object,
            _logger.Object);   
    }

    [Fact]
    public async Task GetComputerById_WhenComputerNotFound_ThrowsKeyNotFound()
    {
        _computerRepository
            .Setup(repo => repo.GetComputerById(It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Computer?)null);

        Func<Task> act = async () => await _computerService.GetComputerById(1, CancellationToken.None);

        await act.Should().ThrowAsync<KeyNotFoundException>();
    }

    [Fact]
    public async Task GetComputerById_WhenComputerExists_ReturnsComputer()
    {
        _computerRepository
            .Setup(repo => repo.GetComputerById(It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Computer { Id = 1, Name = "Test" });

        _mapper
            .Setup(n => n.Map<ComputerResponseDto>(It.IsAny<Computer>()))
            .Returns(new ComputerResponseDto());

        var result = await _computerService.GetComputerById(1, CancellationToken.None);

        result.Should().NotBeNull();
    }

    [Fact]
    public async Task CreateComputer_WhenValidData_SavesComputer()
    {
        var dto = new CreateComputerDto
        {
            Name = "Test",
            Category = ComputerCategory.Standard,
            PricePerHour = 100
        };

        _mapper
            .Setup(n => n.Map<Computer>(It.IsAny<CreateComputerDto>()))
            .Returns(new Computer { Id = 1, Name = "Test2", Category = ComputerCategory.Standard, PricePerHour = 100 });

        await _computerService.CreateComputer(dto, CancellationToken.None);

        _unitOfWork.Verify(n => n.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateComputerById_WhenComputerNotFound_ThrowsKeyNotFound()
    {
        _computerRepository
            .Setup(repo => repo.GetComputerById(It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Computer?)null);

        var dto = new UpdateComputerDto { Name = "Test", PricePerHour = 100 };

        Func<Task> act = async () => await _computerService.UpdateComputerById(dto, 1, CancellationToken.None);

        await act.Should().ThrowAsync<KeyNotFoundException>();
    }

    [Fact]
    public async Task DeleteComputerById_WhenComputerNotFound_ThrowsKeyNotFound()
    {
        _computerRepository
            .Setup(repo => repo.GetComputerById(It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Computer?)null);

        Func<Task> act = async () => await _computerService.DeleteComputerById(1, CancellationToken.None);

        await act.Should().ThrowAsync<KeyNotFoundException>();
    }
}