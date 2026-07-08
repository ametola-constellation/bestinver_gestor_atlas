using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services.Validators
{
    public class RegisterValidateRequestHolder : IRegisterValidator
    {
        private readonly Request request;
        private readonly SignUpApplicant holder;
        private readonly int requestsConfigExpirationDays;

        public RegisterValidateRequestHolder(Request requests, SignUpApplicant holder, int requestsConfigExpirationDays)
        {
            this.request = requests;
            this.holder = holder;
            this.requestsConfigExpirationDays = requestsConfigExpirationDays;
        }

        public RegisterValidateResult Validate()
        {
            RegisterValidateResult registerValidateResult = new RegisterValidateResult();
            registerValidateResult.registerValidationType = RegisterValidationType.Request;
            
            if(request == null)
            {
                registerValidateResult.blockRegister = false;
                registerValidateResult.requestResult = RegisterValidationRequestResult.NewRequest;
                return registerValidateResult;
            }
            
            var currentstatus = request.Status?.OrderByDescending(r => r.StartDate).FirstOrDefault()?.IdStatus;

            switch (currentstatus)
            {
                case (int)RequestStatusEnum.Prospect:
                    registerValidateResult.blockRegister = false;
                    registerValidateResult.requestResult = RegisterValidationRequestResult.ContinueRequest;
                    registerValidateResult.requestToContinue = request;
                    break;

                case (int)RequestStatusEnum.Canceled:
                case (int)RequestStatusEnum.Rejected:
                case (int)RequestStatusEnum.Expired:
                case (int)RequestStatusEnum.Register:
                    var daysFromStartDate = (DateTime.UtcNow - request.RequestStartDate.Value).TotalDays;
                    bool expired = daysFromStartDate > requestsConfigExpirationDays;
                    if (expired && currentstatus == (int)RequestStatusEnum.Canceled)
                        registerValidateResult.ParentRequestId = request.Id;

                    registerValidateResult.blockRegister = false;
                    registerValidateResult.requestResult = RegisterValidationRequestResult.RenewRequest;
                    registerValidateResult.requestToContinue = request;
                    break;
                
                default:
                    registerValidateResult.blockRegister = true;
                    registerValidateResult.requestResult = RegisterValidationRequestResult.Abort;
                    registerValidateResult.customException = new InvalidOperationException("Ya tenemos un proceso de solicitud abierto. Debe ponerse en contacto con nosotros para ayudarle a finalizarlo.");
                    break;
            }

            return registerValidateResult;
        }
    }
}
