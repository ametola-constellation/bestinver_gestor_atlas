using BESTINVER.GestorAltas.MicroservicesProxy.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services.Validators
{
    public class RegisterValidateExistsInRD : IRegisterValidator
    {
        private readonly bool existsInRD;

        public RegisterValidateExistsInRD(bool existsInRD)
        {
            this.existsInRD = existsInRD;
        }

        public RegisterValidateResult Validate()
        {
            return new RegisterValidateResult
            {
                blockRegister = existsInRD,
                registerValidationType = RegisterValidationType.None,
                customException = existsInRD ? new RDConflictException("Para la contratación de un producto puede dirigirse a la Zona Cliente o llamar al teléfono del Centro de Relación con el Inversor 900 878 280.") : null
            };
        }
    }
}
