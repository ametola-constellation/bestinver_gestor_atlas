namespace System
{
#if NET6_0
    [Serializable]
#endif
    public class IdentityHttpClientException : Exception
    {
        public IdentityHttpClientException()
        {
        }
#if NET6_0
        protected IdentityHttpClientException(Runtime.Serialization.SerializationInfo info, Runtime.Serialization.StreamingContext context) : base(info, context)
        {
        }
#endif

        public IdentityHttpClientException(string message) : base(message)
        {
        }

        public IdentityHttpClientException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}