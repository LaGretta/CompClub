namespace AuthService.Domain.Exceptions.Services;

public class IncompleteHttpCookieDatasetException: Exception
{
    public List<string> FieldNames {get; set; }

    public IncompleteHttpCookieDatasetException(List<string> fieldNames) : base($"\nThe service was not provided with the list of data from HTTP cookies:{fieldNames}")
    {
        FieldNames = fieldNames;
    }
}