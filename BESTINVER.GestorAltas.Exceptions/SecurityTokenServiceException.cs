namespace System
{
#if NET6_0
    [Serializable]
#endif
    public sealed class SecurityTokenServiceException : Exception
    {
        public SecurityTokenServiceException(string message) : base(message)
        {
        }

        public SecurityTokenServiceException(string message, Exception innerException) : base(message, innerException)
        {
        }

        public SecurityTokenServiceException()
        {
        }
#if NET6_0
        private SecurityTokenServiceException(Runtime.Serialization.SerializationInfo info, Runtime.Serialization.StreamingContext context) : base(info, context)
        {
        }
#endif
    }
}