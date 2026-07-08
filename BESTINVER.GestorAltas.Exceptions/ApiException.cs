namespace System
{
#if NET6_0
    [Serializable]
#endif
    public sealed class ApiException : Exception
    {
        public ApiException()
        {
        }
#if NET6_0
        private ApiException(Runtime.Serialization.SerializationInfo info, Runtime.Serialization.StreamingContext context) : base(info, context)
        {
        }
#endif

        public ApiException(string message) : base(message)
        {
        }

        public ApiException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}