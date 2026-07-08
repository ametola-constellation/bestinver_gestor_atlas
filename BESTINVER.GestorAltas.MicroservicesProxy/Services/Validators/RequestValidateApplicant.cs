using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services.Validators
{
    public class RequestValidateApplicant : IRegisterValidator
    {
        private readonly SignUpApplicant applicant;
        private readonly Guid currentRequest;
        private readonly Request lastRequestAsHolder;

        public RequestValidateApplicant(SignUpApplicant applicant, Guid currentRequest, Request lastRequestAsHolder)
        {
            this.applicant = applicant;
            this.currentRequest = currentRequest;
            this.lastRequestAsHolder = lastRequestAsHolder;
        }

        public RegisterValidateResult Validate()
        {
            bool applicantIsInRequest = false;

            if (applicant != null)
                applicantIsInRequest = applicant.ApplicantRole.Any(a => a.RequestId == currentRequest);
            
            RegisterValidateResult registerValidateResult = new RegisterValidateResult
            {
                applicantResult = applicant == null ? RegisterValidationApplicantResult.Add : RegisterValidationApplicantResult.Update,
                blockRegister = false,
                applicantRoleResult = applicantIsInRequest ? RegisterValidationApplicantRoleResult.Update : RegisterValidationApplicantRoleResult.Add,
                registerValidationType = RegisterValidationType.Applicant
            };

            return registerValidateResult;
        }

        public SignUpApplicant GetApplicant()
        {
            return applicant;
        }
    }
}
