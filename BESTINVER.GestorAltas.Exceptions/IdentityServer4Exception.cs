namespace System
{
#if NET6_0
    [Serializable]
#endif
    public sealed class IdentityServer4Exception : Exception
    {
        public IdentityServer4Exception(string message) : base(message)
        {
        }

        public IdentityServer4Exception(string message, Exception innerException) : base(message, innerException)
        {
        }

        public IdentityServer4Exception()
        {
        }
#if NET6_0
        private IdentityServer4Exception(Runtime.Serialization.SerializationInfo info, Runtime.Serialization.StreamingContext context) : base(info, context)
        {
        }
#endif
    }
}