namespace System.ComponentModel.DataAnnotations
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
    public class RequiredGuidAttribute : RequiredAttribute
    {
        public override bool IsValid(object value)
        {
            Guid.TryParse(value?.ToString() ?? string.Empty, out Guid result);
            if (result == Guid.Empty)
            {
                AllowEmptyStrings = false;
                return base.IsValid(string.Empty);
            }
            return base.IsValid(value);
        }
    }
}