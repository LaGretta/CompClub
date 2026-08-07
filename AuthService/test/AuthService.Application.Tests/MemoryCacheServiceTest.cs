using AuthService.Application.Services;
using AuthService.Application.Tests.Data;
using AuthService.Domain.DTOs.Cache;
using AuthService.Domain.DTOs.Options.Cache;
using AuthService.Domain.Models;
using FluentAssertions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Xunit;

namespace AuthService.Application.Tests;

public class MemoryCacheServiceTest
{
    [Theory]
    [ClassData(typeof(MemberCacheServiceTestData))]
    public async Task GetOrCreateAsync_ShouldBeTwoCalls(QueryExecutionContext<User> context)
    {
        var options = Options.Create(new CacheOptions
        {
            //
            User = new CacheEntryPolicy()
            {
                AbsoluteExpiration= new TimeSpan(0,1,0),
                SlidingExpiration= new TimeSpan(0,1,0),
                Priority= CacheItemPriority.Normal
            },
            Session =new CacheEntryPolicy()
            {
                AbsoluteExpiration= new TimeSpan(0,1,0),
                SlidingExpiration= new TimeSpan(0,1,0),
                Priority= CacheItemPriority.Normal
            },
            Role = new CacheEntryPolicy()
            {
                AbsoluteExpiration= new TimeSpan(0,1,0),
                SlidingExpiration= new TimeSpan(0,1,0),
                Priority= CacheItemPriority.Normal
            },
            UserRole = new CacheEntryPolicy()
            {
                AbsoluteExpiration= new TimeSpan(0,1,0),
                SlidingExpiration= new TimeSpan(0,1,0),
                Priority= CacheItemPriority.Normal
            }
        });
        
        var memoryCache = new MemoryCache(new MemoryCacheOptions());
        
        var service = new MemoryCacheService(memoryCache, options);
        
        var count = 0;

        Task<Guid> Factory()
        {
            count++;

            return Task.FromResult(Guid.NewGuid());
        }
        //
        
        await service.GetOrCreateAsync(context, Factory);

        service.Remove(context);

        await service.GetOrCreateAsync(context, Factory);
        //
        count.Should().Be(2);
    }
    [Theory]
    [ClassData(typeof(MemberCacheServiceTestData))]
    public async Task GetOrCreateAsync_ShouldBeOneCall(QueryExecutionContext<User> context)
    {
        var options = Options.Create(new CacheOptions
        {
            //
            User = new CacheEntryPolicy()
            {
                AbsoluteExpiration= new TimeSpan(0,1,0),
                SlidingExpiration= new TimeSpan(0,1,0),
                Priority= CacheItemPriority.Normal
            },
            Session =new CacheEntryPolicy()
            {
                AbsoluteExpiration= new TimeSpan(0,1,0),
                SlidingExpiration= new TimeSpan(0,1,0),
                Priority= CacheItemPriority.Normal
            },
            Role = new CacheEntryPolicy()
            {
                AbsoluteExpiration= new TimeSpan(0,1,0),
                SlidingExpiration= new TimeSpan(0,1,0),
                Priority= CacheItemPriority.Normal
            },
            UserRole = new CacheEntryPolicy()
            {
                AbsoluteExpiration= new TimeSpan(0,1,0),
                SlidingExpiration= new TimeSpan(0,1,0),
                Priority= CacheItemPriority.Normal
            }
        });
        
        var memoryCache = new MemoryCache(new MemoryCacheOptions());
        
        var service = new MemoryCacheService(memoryCache, options);
        
        var count = 0;

        Task<Guid> Factory()
        {
            count++;

            return Task.FromResult(Guid.NewGuid());
        }
        //
        
        await service.GetOrCreateAsync(context, Factory);
        

        await service.GetOrCreateAsync(context, Factory);
        //
        count.Should().Be(1);
    }
    
}