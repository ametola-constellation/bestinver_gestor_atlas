using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Common.Exceptions
{
    public class GenericLoginException : LoginException
    {
        public override string FriendlyMessage { get => "Se ha producido un error, reinténtelo más tarde o contacte con el administrador"; }
    }
}
