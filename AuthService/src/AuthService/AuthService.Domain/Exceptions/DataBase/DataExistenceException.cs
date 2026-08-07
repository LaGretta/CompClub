namespace AuthService.Domain.Exceptions.DataBase;

public class DataExistenceException: Exception
{
    public string DbSetName { get; init; }
    public string Predicate {get; init; }

    public DataExistenceException(string dbSetName, string predicate) : base(
        $"Expected data not received from table \"f{dbSetName}\" with the \"{predicate}\" predicate")
    {
        DbSetName = dbSetName;
        Predicate = predicate;
    }
}