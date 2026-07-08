namespace System
{
#if NET6_0
    [Serializable]
#endif
    public class ManageException : Exception
    {
        public ManageException()
        {
        }
#if NET6_0
        protected ManageException(Runtime.Serialization.SerializationInfo info, Runtime.Serialization.StreamingContext context) : base(info, context)
        {
        }
#endif
        public ManageException(string message) : base(message)
        {
        }

        public ManageException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}