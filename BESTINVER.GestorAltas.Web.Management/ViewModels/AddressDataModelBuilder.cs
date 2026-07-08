using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BESTINVER.GestorAltas.Web.Management.Models.Details;
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
    public class AddressDataModelBuilder
    {
        private LockedItemModel lockedItem;
        private readonly HttpContext context;
        private AddressData addressItem;
        private Guid requestId;
        private IEnumerable<SelectItemModel> countriesItem = Enumerable.Empty<SelectItemModel>();
        private IEnumerable<SelectItemModel> viaTypes = Enumerable.Empty<SelectItemModel>();
        private PermissionResult permisionResult;
        private bool differentPostalAddress;
        private string addressTypeItem;
        private string DNI;
        private bool showOperationChange;

       
        private IEnumerable<RequestStatusModel> status = Enumerable.Empty<RequestStatusModel>();

        public AddressDataModelBuilder()
        {
        }

        public AddressDataModelBuilder(HttpContext context)
        {
            this.context = context;
        }

        public AddressDataModelBuilder WithRequestId(Guid requestId)
        {
            this.requestId = requestId;
            return this;
        }

        public AddressDataModelBuilder WithLockedItem(LockedItemModel lockedItem)
        {
            this.lockedItem = lockedItem;
            return this;
        }

        public AddressDataModelBuilder WithCountries(IEnumerable<SelectItemModel> countries)
        {
            this.countriesItem = countries;
            return this;
        }

        public AddressDataModelBuilder WithViaTypes(IEnumerable<SelectItemModel> viaTypes)
        {
            this.viaTypes = viaTypes;
            return this;
        }

        public AddressDataModelBuilder WithPermissions(IAuthorizationService authorizationService)
        {
            permisionResult = new PermissionResultBuilder(context, authorizationService).Build().GetAwaiter().GetResult();
            return this;
        }

        public AddressDataModelBuilder WithDifferentPostalAddress(bool differentPostalAddress)
        {
            this.differentPostalAddress = differentPostalAddress;
            return this;
        }

        public AddressDataModelBuilder WithAddress(AddressData addressData)
        {
            this.addressItem = addressData;
            return this;
        }

        public AddressDataModelBuilder WithAddressType(string addressType)
        {
            this.addressTypeItem = addressType;
            return this;
        }

        public AddressDataModelBuilder WithDNI(string dni)
        {
            this.DNI = dni;
            return this;
        }

        public AddressDataModelBuilder WithShowOperationChange(bool showOperationChange)
        {
            this.showOperationChange = showOperationChange;
            return this;
        }

        public AddressDataModelBuilder WithStatus(IEnumerable<RequestStatusModel> status)
        {
            this.status = status;
            return this;
        }

        public AddressDataModel Build()
        {
            var requestStatus = status?.LastOrDefault()?.IDStatus;
            var model = new AddressDataModel();

            SetLocks(model);
            SetAddressType(model);
            SetAddressData(model);
            SetDisabledSaveButton(requestStatus,model);
            SetDisabled(model);
            model.RequestId = requestId;
            model.Countries = countriesItem.ToList();
            model.ViaTypes = viaTypes.ToList();
            SetDifferentPostalAddressCheck(model);
            model.DifferentPostalAddress = differentPostalAddress;
            model.ShowOperationChange = showOperationChange;
            return model;
        }

        private void SetAddressData(AddressDataModel model)
        {
            model.AddressExtension = addressItem.AddressExtension;
            //model.AddressType = addressItem.AddressType;
            model.City = addressItem.City;
            model.CountryType = addressItem.CountryType;
            model.Door = addressItem.Door;
            model.Floor = addressItem.Floor;
            model.IdCountry = addressItem.IdCountry;
            model.Name = addressItem.Name;
            model.Number = addressItem.Number;
            model.PostalCode = addressItem.PostalCode;
            model.Province = addressItem.Province;
            model.Stairs = addressItem.Stairs;
            model.ViaType = addressItem.ViaType;
            model.Id = addressItem.Id;
            model.DNI = DNI;
        }

        private void SetLocks(AddressDataModel model)
        {
            model.LockedIsLocked = lockedItem.LockedIsLocked;
            model.LockedStartDate = lockedItem.LockedStartDate;
            model.LockedUserEmail = lockedItem.LockedUserEmail;
            model.LockedUserName = lockedItem.LockedUserName;
        }

        private void SetDisabledSaveButton(int? requestStatus,AddressDataModel model)
        {


            if (lockedItem.LockedIsLocked && lockedItem.LockedUserName == context.User.Identity.Name && permisionResult.HasSolicitudModificacion
                 && (requestStatus == (int)RequestStatusEnum.Prospect || requestStatus == (int)RequestStatusEnum.PendingSignature || requestStatus == (int)RequestStatusEnum.Locked))
            {
                model.DisabledSaveButton = ActionEnabler.Enable;
            }
        }

        private void SetDisabled(AddressDataModel model)
        {
            if (lockedItem.LockedIsLocked && lockedItem.LockedUserName == context.User.Identity.Name)
            {
                model.Disabled = ActionEnabler.Enable;
            }
        }

        private void SetAddressType(AddressDataModel model)
        {
            model.AddressType = addressTypeItem;
        }

        private void SetDifferentPostalAddressCheck(AddressDataModel model)
        {
            if (addressTypeItem == AddressType.Fiscal)
            {
                model.ShowDifferentPostalAddressCheck = true;
            }
        }
    }
}