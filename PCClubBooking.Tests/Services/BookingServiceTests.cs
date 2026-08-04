using AutoMapper;
using FluentAssertions;
using Moq;
using PCClubBooking.Application.DTOs;
using PCClubBooking.Application.Interfaces;
using PCClubBooking.Application.Interfaces.Repository;
using PCClubBooking.Application.Service;
using PCClubBooking.Application.Validators;
using PCClubBooking.Domain.Entities;
using PCClubBooking.Domain.Enums;
using Xunit;

namespace PCClubBooking.Tests.Services;

public class BookingServiceTests
{
    private readonly Mock<IBookingRepository> _bookingRepository;
    private readonly Mock<IComputerRepository> _computerRepository;
    private readonly Mock<IMapper> _mapper;
    private readonly Mock<IUnitOfWork> _unitOfWork;
    private readonly Mock<ILogger<BookingService>> _logger;   
    private readonly BookingService _bookingService;

    public BookingServiceTests()
    {
        _bookingRepository = new Mock<IBookingRepository>();
        _computerRepository = new Mock<IComputerRepository>();
        _mapper = new Mock<IMapper>();
        _unitOfWork = new Mock<IUnitOfWork>();
        _logger = new Mock<ILogger<BookingService>>(); 

        _bookingService = new BookingService(
            _bookingRepository.Object
            , _computerRepository.Object
            , _mapper.Object
            , _unitOfWork.Object
            , _logger.Object);  
    }

    [Fact]
    public async Task CreateBooking_ComputerNotFound_ThrowsKeyNotFound()
    {
        _computerRepository
            .Setup(n => n.GetComputerById(It.IsAny<int>()
                , It.IsAny<CancellationToken>())).ReturnsAsync((Computer?)null);

        var dto = new CreateBookingDto
        {
            ComputerId = 1,
            StartTime = DateTime.UtcNow,
            EndTime = DateTime.UtcNow.AddHours(2),
        };

        Func<Task> act = async () => await _bookingService.CreateBooking(dto , userId: 1,CancellationToken.None);
        
        await act.Should().ThrowAsync<KeyNotFoundException>();
    }
    
    [Fact]
    public async Task CreateBooking_ComputerNotWorking_ThrowsInvalidOperation()
    {
        var dto = new CreateBookingDto
        {
            ComputerId = 1,
            StartTime = DateTime.UtcNow.AddHours(2),
            EndTime = DateTime.UtcNow.AddHours(3),
        };
        _computerRepository
            .Setup(n => n.GetComputerById(It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Computer
        {
            Id = 1,
            IsWorking =  false,
            PricePerHour = 50
        });
        
        Func<Task> result = async () => await _bookingService.CreateBooking(dto , userId: 1,CancellationToken.None);
        await result.Should().ThrowAsync<InvalidOperationException>();
    }

    [Fact]
    public async Task CreateBooking_EndTimeBeforeStartTime_ThrowsArgument()
    {
        var dto = new CreateBookingDto
        {
            ComputerId = 1,
            StartTime = DateTime.UtcNow.AddHours(2),
            EndTime = DateTime.UtcNow.AddHours(1),
        };
        _computerRepository.Setup(n => n.GetComputerById(It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Computer
            {
                Id = 1,
                IsWorking = true,
                PricePerHour = 50
            });
        
        Func<Task> result = async () => await _bookingService.CreateBooking(dto, userId:1,CancellationToken.None);
        
        await result.Should().ThrowAsync<ArgumentException>();
            
    }

    [Fact]
    public async Task CreateBooking_WhenHasOverlappingBooking_ThrowsInvalidOperation()
    {
        var dto = new CreateBookingDto
        {
            ComputerId = 1,
            StartTime = DateTime.UtcNow.AddHours(2),
            EndTime = DateTime.UtcNow.AddHours(3),
        };

        _computerRepository.Setup(n => n.GetComputerById(It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Computer
            {
                Id = 1,
                IsWorking = true,
                PricePerHour = 50
            });
        
        _bookingRepository
            .Setup(n => n.HasOverlappingBookingAsync(
                It.IsAny<int>()
                , It.IsAny<DateTime>()
                , It.IsAny<DateTime>()
                ,It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        
        Func<Task> result = async () => await _bookingService.CreateBooking(dto, userId: 1, CancellationToken.None);
        
        await result.Should().ThrowAsync<InvalidOperationException>();
    }

    [Fact]
    public async Task CreateBooking_ValidData_CreatesBookingAndCommits()
    {
        var dto = new CreateBookingDto
        {
            ComputerId = 1,
            StartTime = DateTime.UtcNow.AddHours(2),
            EndTime = DateTime.UtcNow.AddHours(4),
        };
        _computerRepository.Setup(n => n.GetComputerById(It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Computer
                {
                    Id = 1,
                    IsWorking = true,
                    PricePerHour = 50,
                });
        
        _bookingRepository
            .Setup(n => n.HasOverlappingBookingAsync(
                It.IsAny<int>()
                , It.IsAny<DateTime>()
                , It.IsAny<DateTime>()
                ,It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        
        _mapper.Setup(n => n.Map<Booking>(It.IsAny<CreateBookingDto>()))
            .Returns(new Booking
            {
                ComputerId = 1
            });
        
        _mapper.Setup(n => n.Map<ResponseBookingDto>(It.IsAny<Booking>()))
            .Returns(new ResponseBookingDto());
    
        var result = await _bookingService.CreateBooking(dto , userId: 1, CancellationToken.None);

        result.Should().NotBeNull();
        
        _bookingRepository.Verify(n => n.CreateBooking(It.IsAny<Booking>(), It.IsAny<CancellationToken>())
            , Times.Once);

        _unitOfWork.Verify(
            u => u.CommitTransactionAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task CancelBooking_WhenBookingIsNotFound_KeyNotFoundException()
    {
        _bookingRepository
            .Setup(n => n.GetMyBookingById(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Booking?)null);
        Func<Task> act = async () => await _bookingService.CancelBooking(bookingId: 1, userId: 1, CancellationToken.None);

        await act.Should().ThrowAsync<KeyNotFoundException>();
    }

    [Fact]
    public async Task CancelBooking_WhenBookingIsNotActive_InvalidOperationException()
    {
        _bookingRepository
            .Setup(n => n.GetMyBookingById(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Booking { Id = 1, Status = BookingStatus.Completed });

        Func<Task> act = async () => await _bookingService.CancelBooking(bookingId: 1, userId: 1, CancellationToken.None);

        await act.Should().ThrowAsync<InvalidOperationException>();
    }

    [Fact]
    public async Task CancelBooking_WhenBookingIsActive_CancelsAndCommits()
    {
        _bookingRepository
            .Setup(n => n.GetMyBookingById(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Booking { Id = 1, Status = BookingStatus.Active });

        _mapper.Setup(n => n.Map<ResponseBookingDto>(It.IsAny<Booking>()))
            .Returns(new ResponseBookingDto());
        
        var result = await _bookingService.CancelBooking(1, 1, CancellationToken.None);

        result.Should().NotBeNull();

        _unitOfWork.Verify(
            u => u.CommitTransactionAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }
}