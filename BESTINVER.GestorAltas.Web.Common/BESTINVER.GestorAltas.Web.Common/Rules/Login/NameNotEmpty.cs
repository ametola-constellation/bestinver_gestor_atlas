using bestinver.crossapp.common.rules;
using BESTINVER.GestorAltas.Web.Common.Exceptions;
using BESTINVER.GestorAltas.Web.Common.Models;
using System;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Common.Rules.Login
{
    internal class NameNotEmpty : IRule<LoginRequest>
    {
        public Task<bool> Check(LoginRequest obj)
        {
            if(obj.Name==null || obj.Name.Trim()==String.Empty)
            {
                throw new CustomLoginException("El nombre de usuario es obligatorio");
            }

            return Task.FromResult(true);
        }
    }
}
