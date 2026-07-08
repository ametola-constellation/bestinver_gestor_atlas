using System;

namespace BESTINVER.GestorAltas.Exceptions
{
    /// <summary>
    /// Excepción utilizar para elevar alertas de terrorismo a través del Webapi
    /// </summary>
#if NET6_0
    [Serializable]
#endif
    public class GAForbiddenException : Exception
    {
        public GAForbiddenException()
        {
        }

        public GAForbiddenException(string message) : base(message)
        {
        }

        public GAForbiddenException(string message, Exception inner) : base(message, inner)
        {
        }
#if NET6_0
        protected GAForbiddenException(System.Runtime.Serialization.SerializationInfo info, System.Runtime.Serialization.StreamingContext context) : base(info, context)
        {
        }
#endif
    }
}