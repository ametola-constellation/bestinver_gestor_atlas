using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Common.Exceptions
{
    public class LoginFailedException : LoginException
    {
        public override string FriendlyMessage { get => "login incorrecto"; }
    }
}
