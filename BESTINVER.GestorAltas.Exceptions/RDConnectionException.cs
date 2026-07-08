using System;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Exceptions
{
#if NET6_0
    [Serializable]
#endif
    public class RDConnectionException : Exception
    {
        public RDConnectionException()
        {
        }

        public RDConnectionException(string message) : base(message)
        {
        }

        public RDConnectionException(string message, Exception innerException) : base(message, innerException)
        {
        }
#if NET6_0
        protected RDConnectionException(System.Runtime.Serialization.SerializationInfo info, System.Runtime.Serialization.StreamingContext context) : base(info, context)
        {
        }
#endif
    }
}