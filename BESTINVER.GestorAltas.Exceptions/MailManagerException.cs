using System;

namespace BESTINVER.GestorAltas
{
#if NET6_0
    [Serializable]
#endif
    public class MailManagerException : Exception
    {
        public MailManagerException()
        {
        }
#if NET6_0
        protected MailManagerException(System.Runtime.Serialization.SerializationInfo info, System.Runtime.Serialization.StreamingContext context) : base(info, context)
        {
        }
#endif

        public MailManagerException(string message) : base(message)
        {
        }

        public MailManagerException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}