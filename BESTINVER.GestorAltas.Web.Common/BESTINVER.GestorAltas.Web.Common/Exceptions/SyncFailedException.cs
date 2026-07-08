using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Common.Exceptions
{
    public class SyncFailedException : LoginException
    {
        public override string FriendlyMessage { get => "Error al sincronizar el usuario"; }
    }
}
