using System;

namespace BESTINVER.GestorAltas.Exceptions
{
#if NET6_0
    [Serializable]
#endif
    public class SaveBasicDataException : Exception
    {
        public SaveBasicDataException() { }

        public SaveBasicDataException(string message) : base(message) { }

        public SaveBasicDataException(string message, Exception innerException) : base(message, innerException) { }

#if NET6_0
        protected SaveBasicDataException(System.Runtime.Serialization.SerializationInfo info, System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
#endif
    }
}
