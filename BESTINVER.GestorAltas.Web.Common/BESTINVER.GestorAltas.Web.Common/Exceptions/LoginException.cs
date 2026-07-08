using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Common.Exceptions
{
    public abstract class LoginException : Exception
    {
        public virtual string FriendlyMessage { get; set; }
    }
}
