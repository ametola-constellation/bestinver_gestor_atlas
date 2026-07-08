using System;

namespace BESTINVER.GestorAltas
{
//https://github.com/dotnet/docs/issues/34893
#if NET6_0
    [Serializable]
#endif
    public class RebrandlyException : Exception
    {
        public RebrandlyException()
        {
        }
#if NET6_0
        protected RebrandlyException(System.Runtime.Serialization.SerializationInfo info, System.Runtime.Serialization.StreamingContext context) : base(info, context)
        {
        }
#endif

        public RebrandlyException(string message) : base(message)
        {
        }

        public RebrandlyException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}