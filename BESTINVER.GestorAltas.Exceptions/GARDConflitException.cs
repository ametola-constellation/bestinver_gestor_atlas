using System;
using System.Runtime.Serialization;

namespace BESTINVER.GestorAltas.Exceptions
{
    /// <summary>
    /// Excepción utilizada para indicar que un cliente existe en RD
    /// </summary>
#if NET6_0
    [Serializable]
#endif
    public class GardConflitException : Exception
    {
        public GardConflitException()
        {
        }

        public GardConflitException(string message) : base(message)
        {
        }

        public GardConflitException(string message, Exception innerException) : base(message, innerException)
        {
        }
#if NET6_0
        protected GardConflitException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
#endif
    }
}