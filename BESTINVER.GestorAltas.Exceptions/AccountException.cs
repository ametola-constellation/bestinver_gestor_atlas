namespace System
{
#if NET6_0
    [Serializable]
#endif
    public class AccountException : Exception
    {
#if NET6_0
        protected AccountException(Runtime.Serialization.SerializationInfo info, Runtime.Serialization.StreamingContext context) : base(info, context)
        {
        }
#endif

        public AccountException(string message) : base(message)
        {
        }

        public AccountException(string message, Exception innerException) : base(message, innerException)
        {
        }

        public AccountException()
        {
        }
    }
}