using bestinver.crossapp.common.rules;
using BESTINVER.GestorAltas.Web.Common.Exceptions;
using BESTINVER.GestorAltas.Web.Common.Models;
using System;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Common.Rules.Login
{
    internal class PasswordNotEmpty : IRule<LoginRequest>
    {
        public Task<bool> Check(LoginRequest obj)
        {
            if(obj.Password==null || obj.Password.Trim()==String.Empty)
            {
                throw new CustomLoginException("La clave de usuario es obligatoria");
            }

            return Task.FromResult(true);
        }
    }
}
