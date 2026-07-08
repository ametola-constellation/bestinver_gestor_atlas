namespace System
{
#if NET6_0
    [Serializable]
#endif
    public class CarteraException : Exception
    {
        public CarteraException()
        {
        }

        public CarteraException(string message) : base(message)
        {
        }

        public CarteraException(string message, Exception innerException) : base(message, innerException)
        {
        }

#if NET6_0
        protected CarteraException(Runtime.Serialization.SerializationInfo info, Runtime.Serialization.StreamingContext context) : base(info, context)
        {
        }
#endif
    }
}