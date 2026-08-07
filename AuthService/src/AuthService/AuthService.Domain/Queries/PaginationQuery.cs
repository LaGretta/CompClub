namespace AuthService.Domain.Queries;

public sealed class PaginationQuery
{
    public int Page { get; }
    public int PageSize { get; }//Take
    public int Skip { get; } 

    public PaginationQuery(int page, int pageSize)
    {
        if (page < 1)
            throw new ArgumentOutOfRangeException(nameof(page));

        if (pageSize < 1)
            throw new ArgumentOutOfRangeException(nameof(pageSize));

        Page = page;
        PageSize = pageSize;
        Skip=(Page - 1) * PageSize;
    }
}