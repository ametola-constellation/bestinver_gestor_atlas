using BestInver.WebPrivada.Shared.Models.Microservices.Alerts;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services.Validators
{
    public class RegisterValidateResult
    {
        public IEnumerable<Alert> alerts { get; set; }
        public bool blockRegister { get; set; }
        public Exception customException { get; set; }
        public RegisterValidationRequestResult requestResult { get; set; }
        public RegisterValidationApplicantResult applicantResult { get; set; }
        public RegisterValidationApplicantRoleResult applicantRoleResult { get; set; }
        public RegisterValidationType registerValidationType { get; set; }
        public Request requestToContinue { get; set; }
        public Guid ParentRequestId { get; set; } = Guid.Empty;
    }

    public enum RegisterValidationRequestResult
    {
        NewRequest = 1,
        ContinueRequest = 2,
        RenewRequest = 3,
        Abort = 4
    }

    public enum RegisterValidationApplicantResult
    {
        Add = 1,
        Update = 2,
        Abort = 3
    }

    public enum RegisterValidationApplicantRoleResult
    {
        Add = 1,
        Update = 2,
        Abort = 3
    }

    public enum RegisterValidationType
    {
        Request = 1,
        Applicant = 2,
        Operation = 3,
        None = 4,
    }

    public enum RegisterValidationStep
    {
        BasicData = 1,
        RequestData = 2,
        SignatureData = 3,
        DniData = 4,
    }
}
