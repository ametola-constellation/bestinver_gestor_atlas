using System;

namespace BESTINVER.GestorAltas.Exceptions
{
    /// <summary>
    /// Excepción utilizara para indicar que no hay conectividad con RD
    /// </summary>
#if NET6_0
    [Serializable]
#endif
    public class GardException : Exception
    {
        public GardException()
        {
        }

        public GardException(string message) : base(message)
        {
        }

        public GardException(string message, Exception inner) : base(message, inner)
        {
        }
#if NET6_0
        protected GardException(System.Runtime.Serialization.SerializationInfo info, System.Runtime.Serialization.StreamingContext context) : base(info, context)
        {
        }
#endif
    }
}