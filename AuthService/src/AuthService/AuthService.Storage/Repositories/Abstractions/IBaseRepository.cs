using AuthService.Domain.Queries;
using AuthService.Domain.Queries.ExecutionOptions;


namespace AuthService.Storage.Repositories.Abstractions;

public interface IBaseRepository<TEntity> where TEntity : class
{
    IQueryable<TEntity> Set(QueryExecutionOptions? options= null);
    //R
    Task<List<TEntity>> GetAsync(Query<TEntity> query, QueryExecutionOptions? options = null, CancellationToken cancellationToken = default);
    Task<TEntity?> FirstOrDefaultAsync(Query<TEntity> query, QueryExecutionOptions? options = null, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Query<TEntity> query, bool ignoreQueryFilters = false ,CancellationToken cancellationToken = default);
    Task<int> CountAsync(Query<TEntity> query, QueryExecutionOptions? options = null, CancellationToken cancellationToken = default);
      
    // Task<TEntity> FirstAsync(Query<TEntity> query, QueryExecutionOptions? options = null);
    // Task<TEntity?> SingleOrDefaultAsync(Query<TEntity> query);
    // Task<TEntity> SingleAsync(Query<TEntity> query);
    // Task<List<TEntity>> ToListAsync(Query<TEntity> query, QueryExecutionOptions? options = null);
    // Task<int> CountAsync(Query<TEntity> query);
    //CUD
    Task AddAsync(TEntity entity, CancellationToken cancellationToken = default);
    void Update(TEntity entity);
    void Remove(TEntity entity);
    //ExecutionOptions
    // protected IQueryable<TEntity> ApplyTracking<TEntity>(IQueryable<TEntity> query, QueryTracking tracking) where TEntity : class;
    // protected IQueryable<TEntity> ApplySplitting<TEntity>(IQueryable<TEntity> query, QuerySplitting splitting) where TEntity : class;
    // protected IQueryable<TEntity> ApplyOptions<TEntity>(IQueryable<TEntity> query, QueryExecutionOptions options) where TEntity : class;
    //Query
    
}