using System;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Exceptions
{
#if NET6_0
    [Serializable]
#endif
    public class RequestForbiddenException : Exception
    {
        public RequestForbiddenException()
        {
        }

        public RequestForbiddenException(string message) : base(message)
        {
        }

        public RequestForbiddenException(string message, Exception innerException) : base(message, innerException)
        {
        }
#if NET6_0
        protected RequestForbiddenException(System.Runtime.Serialization.SerializationInfo info, System.Runtime.Serialization.StreamingContext context) : base(info, context)
        {
        }
#endif
    }
}