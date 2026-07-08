using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services.Validators
{
    public interface IRegisterValidator
    {
        RegisterValidateResult Validate();
    }
}
