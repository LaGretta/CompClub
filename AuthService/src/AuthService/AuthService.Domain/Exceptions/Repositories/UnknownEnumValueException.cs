namespace AuthService.Domain.Exceptions.Repositories;

public class UnknownEnumValueException: Exception
{
    public string EnumName { get; }
    public string EnumValue { get; }

    public UnknownEnumValueException(string enumName, string enumValue) : base($"there are no value {enumValue} at {enumName}")
    {
        EnumName = enumName;
        EnumValue = enumValue;
    }

}