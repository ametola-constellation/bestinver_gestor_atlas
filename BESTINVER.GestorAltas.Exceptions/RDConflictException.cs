using System;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Exceptions
{
#if NET6_0
    [Serializable]
#endif
    public class RDConflictException : Exception
    {
        public RDConflictException()
        {
        }

        public RDConflictException(string message) : base(message)
        {
        }

        public RDConflictException(string message, Exception innerException) : base(message, innerException)
        {
        }
#if NET6_0
        protected RDConflictException(System.Runtime.Serialization.SerializationInfo info, System.Runtime.Serialization.StreamingContext context) : base(info, context)
        {
        }
#endif
    }
}