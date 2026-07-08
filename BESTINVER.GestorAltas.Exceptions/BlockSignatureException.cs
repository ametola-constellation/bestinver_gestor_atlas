using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Exceptions
{
#if NET6_0
    [Serializable]
#endif
    public class BlockSignatureException : Exception
    {
        public BlockSignatureException() { }

        public BlockSignatureException(string message) : base(message) { }

        public BlockSignatureException(string message, Exception innerException) : base(message, innerException) { }

#if NET6_0
        protected BlockSignatureException(System.Runtime.Serialization.SerializationInfo info, System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
#endif
    }
}
