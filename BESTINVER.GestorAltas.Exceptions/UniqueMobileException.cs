using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace System
{
    public class UniqueMobileException : Exception
    {
        public UniqueMobileException()
        {
        }

        public UniqueMobileException(string message) : base(message)
        {
        }

        public UniqueMobileException(string message, Exception innerException) : base(message, innerException)
        {
        }
#if NET6_0
        protected UniqueMobileException(System.Runtime.Serialization.SerializationInfo info, System.Runtime.Serialization.StreamingContext context) : base(info, context)
        {
        }
#endif
    }
}
