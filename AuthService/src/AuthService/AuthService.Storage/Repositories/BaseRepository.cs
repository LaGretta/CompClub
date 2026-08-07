using AuthService.Domain.DTOs.Cache;
using AuthService.Domain.Enums.Cache;
using AuthService.Domain.Enums.Queries;
using AuthService.Domain.Exceptions.Repositories;
using AuthService.Domain.Queries;
using AuthService.Domain.Queries.ExecutionOptions;
using AuthService.Shared.Abstractions;
using AuthService.Storage.Queries;
using AuthService.Storage.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace AuthService.Storage.Repositories;

public abstract class BaseRepository<TEntity> : IBaseRepository<TEntity> where TEntity: class
{
    
    protected AuthServiceContext Context { get; init; }
    protected IMemoryCacheService MemoryCache { get; init; }
    
    protected BaseRepository(AuthServiceContext context)
    {
        Context = context;
    }
    
    public IQueryable<TEntity> Set(QueryExecutionOptions? options=null)
    {
        options ??= new QueryExecutionOptions();
        
        // if (options == null)
        // {
        //     options = new QueryExecutionOptions();
        // }

        IQueryable<TEntity> query;
        
        switch (options.Tracking)
        {
            case QueryTracking.Default:
                query = Context.Set<TEntity>();
                break;

            case QueryTracking.Track:
                query = Context.Set<TEntity>().AsTracking();
                break;

            case QueryTracking.NoTracking:
                query = Context.Set<TEntity>().AsNoTracking();
                break;
        
            case QueryTracking.NoTrackingWithIdentityResolution:
                query = Context.Set<TEntity>().AsNoTrackingWithIdentityResolution();
                break;
            default:
                throw new UnknownEnumValueException(nameof(QueryTracking), ((int)options.Tracking).ToString());
        }

        if (options.IgnoreQueryFilters)
        {
            query = query.IgnoreQueryFilters();
        }
        return query;
    }
    //
    public async Task<List<TEntity>> GetAsync(Query<TEntity> query, QueryExecutionOptions? options = null, CancellationToken cancellationToken = default)
    {
        var context = CreateContext(query, QueryResultKind.Collection, options);

        return await MemoryCache.GetOrCreateAsync<TEntity, List<TEntity>>(
            context,
            () => EfQueryApplier
                .Apply(Set(options), query)
                .ToListAsync(cancellationToken));
    }
    public async Task<TEntity?> FirstOrDefaultAsync(Query<TEntity> query, QueryExecutionOptions? options = null, CancellationToken cancellationToken = default)
    {
        var context = CreateContext(query, QueryResultKind.Single, options);

        return await MemoryCache.GetOrCreateAsync<TEntity, TEntity?>(
            context,
            () => EfQueryApplier
                .Apply(Set(options), query)
                .FirstOrDefaultAsync(cancellationToken));
    }

    public async Task<bool> AnyAsync(Query<TEntity> query, bool ignoreQueryFilters = false ,CancellationToken cancellationToken = default)
    {
        var options = new QueryExecutionOptions
        {
            IgnoreQueryFilters = ignoreQueryFilters
        };

        var context = CreateContext(query, QueryResultKind.Any, options);

        return await MemoryCache.GetOrCreateAsync<TEntity, bool>(
            context,
            () => EfQueryApplier
                .Apply(Set(options), query)
                .AnyAsync(cancellationToken));
    }

    public async Task<int> CountAsync(Query<TEntity> query, QueryExecutionOptions? options = null, CancellationToken cancellationToken = default)
    {
        var context = CreateContext(query, QueryResultKind.Count, options);

        return await MemoryCache.GetOrCreateAsync<TEntity, int>(
            context,
            () => EfQueryApplier
                .Apply(Set(options), query)
                .CountAsync(cancellationToken));
    }
    //
    public async Task AddAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        await Context.Set<TEntity>().AddAsync(entity,  cancellationToken);
    }

    public void Update(TEntity entity)
    {
        Context.Set<TEntity>().Update(entity);
    }

    public void Remove(TEntity entity)
    {
        Context.Set<TEntity>().Remove(entity);
    }
    //
    private static QueryExecutionContext<TEntity> CreateContext(Query<TEntity> query, QueryResultKind resultKind, QueryExecutionOptions? options)
    {
        options ??= new QueryExecutionOptions();

        return new()
        {
            Query = query,
            ResultKind = resultKind,
            IgnoreQueryFilters = options.IgnoreQueryFilters
        };
    }
}