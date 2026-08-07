using System.Globalization;
using System.Linq.Expressions;
using System.Text;

namespace AuthService.Storage.Queries;

public static class ExpressionExtensions
{
    public static string Serialize<T>(this Expression<Func<T, bool>> expression)
    {
        var visitor = new CacheKeyExpressionVisitor();

        visitor.Visit(expression.Body);

        return visitor.GetResult();
    }
}

internal sealed class CacheKeyExpressionVisitor : ExpressionVisitor
{
    private readonly StringBuilder _builder = new();

    public string GetResult()
        => _builder.ToString();
    private static bool TryEvaluate(Expression expression, out object? value)
    {
        try
        {
            value =Expression.Lambda(expression)
                .Compile(preferInterpretation: true)
                .DynamicInvoke();;

            return true;
        }
        catch
        {
            value = null;
            return false;
        }
    }
    
    protected override Expression VisitBinary(BinaryExpression node)
    {
        _builder.Append("(");
        Visit(node.Left);
        
        // Translate C# operators to your target format
        string op = node.NodeType switch
        {
            ExpressionType.GreaterThanOrEqual => ">=",
            ExpressionType.LessThanOrEqual => "<=",
            ExpressionType.AndAlso => "&&",
            ExpressionType.OrElse => "||",
            ExpressionType.Equal => "==",
            ExpressionType.NotEqual => "!=",
            ExpressionType.GreaterThan => ">",
            ExpressionType.LessThan => "<",
            _ => node.NodeType.ToString()
        };

        _builder.Append(op);
        Visit(node.Right);
        _builder.Append(")");
        
        return node;
    }
    protected override Expression VisitUnary(UnaryExpression node)
    {
        switch (node.NodeType)
        {
            case ExpressionType.Convert:

                Visit(node.Operand);

                break;

            case ExpressionType.Not:

                _builder.Append('!');

                Visit(node.Operand);

                break;

            default:

                base.VisitUnary(node);

                break;
        }

        return node;
    }
    protected override Expression VisitMethodCall(MethodCallExpression node)
    {
        if (node.Object != null)
        {
            Visit(node.Object);
            _builder.Append('.');
        }

        _builder.Append(node.Method.Name);

        _builder.Append('(');

        for (var i = 0; i < node.Arguments.Count; i++)
        {
            if (i > 0)
                _builder.Append(',');

            Visit(node.Arguments[i]);
        }

        _builder.Append(')');

        return node;
    }
    protected override Expression VisitMember(MemberExpression node)
    {
        if (node.Expression is ParameterExpression)
        {
            _builder.Append(node.Member.Name);
            return node;
        }

        if (TryEvaluate(node, out var value))
        {
            AppendConstant(value);
            return node;
        }

        Visit(node.Expression);

        _builder.Append('.');
        _builder.Append(node.Member.Name);

        return node;
    }

    protected override Expression VisitConstant(ConstantExpression node)
    {
        AppendConstant(node.Value);

        return node;
    }
    private void AppendConstant(object? value)
    {
        switch (value)
        {
            case null:
                _builder.Append("null");
                break;

            case string s:
                _builder.Append('"');
                _builder.Append(s);
                _builder.Append('"');
                break;

            case DateTime date:
                _builder.Append(date.ToString("O", CultureInfo.InvariantCulture));
                break;
            case Enum e:
                _builder.Append(Convert.ToInt32(e));
                break;

            case bool b:
                _builder.Append(b ? "true" : "false");
                break;

            default:
                _builder.Append(
                    Convert.ToString(
                        value,
                        CultureInfo.InvariantCulture));

                break;
        }
    }
}