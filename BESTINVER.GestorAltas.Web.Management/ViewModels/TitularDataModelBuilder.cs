using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BESTINVER.GestorAltas.Web.Management.Models;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;

namespace BESTINVER.GestorAltas.Web.Management.ViewModels
{
    public class TitularDataModelBuilder
    {
        private LockedItemModel lockedItem;
        private readonly HttpContext context;
        private ApplicantData applicantItem;
        private Guid requestId;
        private IEnumerable<SelectItemModel> countriesItem = Enumerable.Empty<SelectItemModel>();
        private IEnumerable<SelectItemModel> nationalitiesItem = Enumerable.Empty<SelectItemModel>();
        private IEnumerable<SelectItemModel> gendersItem = Enumerable.Empty<SelectItemModel>();
        private PermissionResult permisionResult;
        private bool showOperationChange;

        private IEnumerable<RequestStatusModel> status = Enumerable.Empty<RequestStatusModel>();

        public TitularDataModelBuilder()
        {
        }

        public TitularDataModelBuilder(HttpContext context)
        {
            this.context = context;
        }

        public TitularDataModelBuilder WithRequestId(Guid requestId)
        {
            this.requestId = requestId;
            return this;
        }

        public TitularDataModelBuilder WithRequestApplicant(ApplicantData applicant)
        {
            this.applicantItem = applicant;
            return this;
        }

        public TitularDataModelBuilder WithLockedItem(LockedItemModel lockedItem)
        {
            this.lockedItem = lockedItem;
            return this;
        }

        public TitularDataModelBuilder WithCountries(IEnumerable<SelectItemModel> countries)
        {
            this.countriesItem = countries;
            return this;
        }

        public TitularDataModelBuilder WithNationalities(IEnumerable<SelectItemModel> nationalities)
        {
            this.nationalitiesItem = nationalities;
            return this;
        }

        public TitularDataModelBuilder WithGenders(IEnumerable<SelectItemModel> genders)
        {
            this.gendersItem = genders;
            return this;
        }

        public TitularDataModelBuilder WithPermissions(IAuthorizationService authorizationService)
        {
            permisionResult = new PermissionResultBuilder(context, authorizationService).Build().GetAwaiter().GetResult();
            return this;
        }

        public TitularDataModelBuilder WithShowOperationChange(bool showOperationChange)
        {
            this.showOperationChange = showOperationChange;
            return this;
        }

        public TitularDataModelBuilder WithStatus(IEnumerable<RequestStatusModel> status)
        {
            this.status = status;
            return this;
        }

        public TitularDataModel Build()
        {
            var model = new TitularDataModel();

            var requestStatus = status?.LastOrDefault()?.IDStatus;

            SetLocks(model);
            SetApplicantData(model);
            SetMinor(model);            
            SetDisabledSaveButton(requestStatus,model);
            SetDisabled(model);           

            model.RequestId = requestId;
            model.Countries = countriesItem.ToList();
            model.Nationalities = nationalitiesItem.ToList();
            model.Genders = gendersItem.ToList();
            model.IsJuridic = applicantItem.BasicData.ApplicantType == (int)ApplicantType.Juridica;
            model.ShowOperationChange = showOperationChange;
            return model;
        }

        private void SetLocks(TitularDataModel model)
        {
            model.LockedIsLocked = lockedItem.LockedIsLocked;
            model.LockedStartDate = lockedItem.LockedStartDate;
            model.LockedUserEmail = lockedItem.LockedUserEmail;
            model.LockedUserName = lockedItem.LockedUserName;
        }

        private void SetApplicantData(TitularDataModel model)
        {
            model.ApplicantType = applicantItem.BasicData.ApplicantType;
            model.Birthday = applicantItem.PersonalData.Birthday;
            model.Country = applicantItem.PersonalData.Country;
            model.DNI = applicantItem.BasicData.DNI;
            model.FirstSurname = applicantItem.BasicData.FirstSurname;
            model.Gender = applicantItem.PersonalData.Gender;
            model.IDDocumentExpirationDate = applicantItem.PersonalData.IDDocumentExpirationDate;
            model.IDDocumentIsPermanent = applicantItem.PersonalData.IDDocumentIsPermanent;
            model.IsResident = applicantItem.PersonalData.IsResident;
            model.Nacionality = applicantItem.PersonalData.Nacionality;
            model.Name = applicantItem.BasicData.Name;
            model.RequestApplicantType = applicantItem.BasicData.RequestApplicantType;
            model.SecondSurname = applicantItem.BasicData.SecondSurname;
            model.gdpr = applicantItem.BasicData.gdpr;
            model.gdprEvents = applicantItem.BasicData.gdprEvents;
            model.gdprDate = applicantItem.BasicData.gdprDate;
            model.gdprEventsDate = applicantItem.BasicData.gdprEventsDate;
            model.RdClientCode = applicantItem.BasicData.RdCode;
        }

        private void SetMinor(TitularDataModel model)
        {
            if (applicantItem.PersonalData.Birthday.HasValue)
            {
                var today = DateTime.Today;
                int age = (int)(today.Year - model.Birthday?.Year);
                if (model.Birthday > today.AddYears(-age)) age--;
                model.IsMinor = age < 18;
            }
            else
            {
                model.IsMinor = false;
            }
        }

        private void SetDisabledSaveButton(int? requestStatus, TitularDataModel model)
        {
            
            
            if (lockedItem.LockedIsLocked && lockedItem.LockedUserName == context.User.Identity.Name && permisionResult.HasSolicitudModificacion 
                && (requestStatus == (int)RequestStatusEnum.Prospect || requestStatus == (int)RequestStatusEnum.PendingSignature || requestStatus == (int)RequestStatusEnum.Locked))
            {                             
                model.DisabledSaveButton = ActionEnabler.Enable;
            }
        }

        private void SetDisabled(TitularDataModel model)
        {
            if (lockedItem.LockedIsLocked && lockedItem.LockedUserName == context.User.Identity.Name)
            {
                model.Disabled = ActionEnabler.Enable;
            }
        }
    }
}