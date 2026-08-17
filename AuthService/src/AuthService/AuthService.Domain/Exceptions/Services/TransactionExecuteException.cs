namespace AuthService.Domain.Exceptions.Services;

public class TransactionExecuteException: Exception
{
    public decimal UserBalance { get; set; }
    public decimal TransactionOperandValue { get; set; }

    public TransactionExecuteException(decimal userBalance, decimal transactionOperandValue) : base(
        $"Transaction execution error with value {transactionOperandValue} involving a balance of {userBalance}.")
    {
        UserBalance = userBalance;
        TransactionOperandValue = transactionOperandValue;
    }
}