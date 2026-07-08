using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Common.Exceptions
{
    public class CustomLoginException : LoginException
    {
        public CustomLoginException(string friendlymessage)
        {
            this.FriendlyMessage = friendlymessage;
        }
    }
}
