using BestInver.WebPrivada.Shared.Models.Backend.Tests.Enums;
using BESTINVER.GestorAltas.Web.Management.Models;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using static BestInver.WebPrivada.Shared.Models.Shared.Enums.ArcopayEnum;

namespace BESTINVER.GestorAltas.Web.Management.ViewModels
{
    public class TitularContactDataModelBuilder
    {
        private LockedItemModel lockedItem;
        private readonly HttpContext context;
        private ApplicantData applicantItem;
        private Guid requestId;
        private PermissionResult permisionResult;
        private IEnumerable<ApplicantData> otherApplicantsItem = [];
        private bool showOperationChange;

     
        private IEnumerable<RequestStatusModel> status = [];

        public TitularContactDataModelBuilder()
        {
        }

        public TitularContactDataModelBuilder(HttpContext context)
        {
            this.context = context;
        }

        public TitularContactDataModelBuilder WithRequestId(Guid requestId)
        {
            this.requestId = requestId;
            return this;
        }

        public TitularContactDataModelBuilder WithRequestApplicant(ApplicantData applicant)
        {
            this.applicantItem = applicant;
            return this;
        }

        public TitularContactDataModelBuilder WithLockedItem(LockedItemModel lockedItem)
        {
            this.lockedItem = lockedItem;
            return this;
        }

        public TitularContactDataModelBuilder WithPermissions(IAuthorizationService authorizationService)
        {
            permisionResult = new PermissionResultBuilder(context, authorizationService).Build().GetAwaiter().GetResult();
            return this;
        }

        public TitularContactDataModelBuilder WithOtherApplicants(IEnumerable<ApplicantData> applicants)
        {
            otherApplicantsItem = applicants;
            return this;
        }

        public TitularContactDataModelBuilder WithShowOperationChange(bool showOperationChange)
        {
            this.showOperationChange = showOperationChange;
            return this;
        }

        public TitularContactDataModelBuilder WithStatus(IEnumerable<RequestStatusModel> status)
        {
            this.status = status;
            return this;
        }


        public TitularContactDataModel Build()
        {
            var model = new TitularContactDataModel();
            var requestStatus = status?.LastOrDefault()?.IDStatus;
            SetLocks(model);
            SetApplicantData(model);
            SetInvalidMobilePhones(model);
            SetDisabledSaveButton(requestStatus,model);
            SetDisabled(model);
            SetRequired(model);
            model.RequestId = requestId;
            model.DNI = applicantItem.BasicData.DNI;
            model.ShowOperationChange = showOperationChange;

            return model;
        }

        private void SetLocks(TitularContactDataModel model)
        {
            model.LockedIsLocked = lockedItem.LockedIsLocked;
            model.LockedStartDate = lockedItem.LockedStartDate;
            model.LockedUserEmail = lockedItem.LockedUserEmail;
            model.LockedUserName = lockedItem.LockedUserName;
        }

        private void SetApplicantData(TitularContactDataModel model)
        {
            model.MobilePhoneNumber = applicantItem.BasicData.MobilePhoneNumber;
            model.Email = applicantItem.BasicData.Email;
            model.PhoneNumber = applicantItem.PersonalData.PhoneNumber;
        }

        private void SetInvalidMobilePhones(TitularContactDataModel model)
        {
            List<string> mobiles = [];
            
            foreach (var app in otherApplicantsItem)
            {
                string mobile = string.IsNullOrEmpty(app.BasicData.MobilePhoneNumber) ? "" : app.BasicData.MobilePhoneNumber;
                if (mobile.StartsWith("+34"))
                {
                    mobile = mobile.Replace("+34", "");
                }
                
                if (app.BasicData.DNI != applicantItem.BasicData.DNI && !app.PersonalData.Birthday.IsMinor())
                {
                    mobiles.Add(mobile);
                }
            }

            model.InvalidPhones = string.Join(';', mobiles.ToArray());

            if (applicantItem.PersonalData.Birthday.IsMinor() || applicantItem.BasicData.ApplicantType == (int)ApplicantType.Juridica)
                model.InvalidPhones = "";
        }

        private void SetDisabledSaveButton(int? requestStatus, TitularContactDataModel model)
        {
            
            if (lockedItem.LockedIsLocked && lockedItem.LockedUserName == context.User.Identity.Name && permisionResult.HasSolicitudModificacion
                && (requestStatus == (int)RequestStatusEnum.Prospect || requestStatus == (int)RequestStatusEnum.PendingSignature || requestStatus == (int)RequestStatusEnum.Locked))
            {
                model.DisabledSaveButton = ActionEnabler.Enable;
            }
        }

        private void SetDisabled(TitularContactDataModel model)
        {
            if (lockedItem.LockedIsLocked && lockedItem.LockedUserName == context.User.Identity.Name)
            {
                model.Disabled = ActionEnabler.Enable;
            }
        }

        private void SetRequired(TitularContactDataModel model)
        {
            if (string.IsNullOrEmpty(applicantItem.BasicData.Email?.Trim()))
                model.IsRequiredEmail = false;

            if (string.IsNullOrEmpty(applicantItem.BasicData.MobilePhoneNumber?.Trim()))
                model.IsRequiredMobilePhone = false;
        }
    }
}