using BESTINVER.GestorAltas.Web.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class ManagementRequestModel : LockedItemModel
    {
        public Guid Id { get; set; }

        [JsonProperty(PropertyName = "data")]
        public ApplicantData Data { get; set; }

        public AddressData PostalAddress { get; set; }
        public AddressData FiscalAddress { get; set; }

        [DisplayName("Mi dirección postal es diferente a la fiscal")]
        public bool DifferentPostalAddress { get; set; }

        public RequestModel Request { get; set; }
        public List<RequestStatusModel> Status { get; set; }
        public List<RequestAlertModel> Alerts { get; set; }

        public List<RequestAlertModel> RequestAlerts { get; set; }
        public List<RequestApplicantModel> Applicants { get; set; }
        public List<ProductOperationModel> ProductOperations { get; set; }
        public List<ManagementSearchCotitularesModel> Cotitulares { get; set; }

        [DisplayName("Gestor comercial")]
        public string GestorComercialName { get; set; }

        [DisplayName("Gestor comercial que realizará el seguimiento")]
        public bool IndGestorComercial { get; set; }

        public bool IsReadonly { get; set; }

        public int TimeZone { get; set; }

        public List<SelectItemModel> DocumentTypes { get; set; }
        public List<SelectItemModel> Genders { get; set; }
        public List<SelectItemModel> Countries { get; set; }
        public List<SelectItemModel> Nationalities { get; set; }
        public List<SelectItemModel> ViaTypes { get; set; }
        public List<SelectItemModel> ApplicantType { get; set; }
        public List<SelectItemModel> AlertTypes { get; set; }
        public bool ShowOperationChange { get; set; }
        public bool ShowUploadSubscriptionDealButton { get; set; }
        public bool ShowRepresentativeSignButton { get; set; }
        public bool ShowRetryRepresentativeSignButton { get; set; }
        public string FileNameToSign { get; set; }
        public bool ProductFamilyRequiereCommitment { get; set; }
        public string DocumentToSignDNI { get; set; }

        public ManagementRequestModel()
        {
            Data = new ApplicantData();
            Request = new RequestModel();
            Status = new List<RequestStatusModel>();
            PostalAddress = new AddressData();
            FiscalAddress = new AddressData();
            Data.BasicData = new ApplicantBasicData();
            Data.PersonalData = new ApplicantPersonalData();
            RequestAlerts = new List<RequestAlertModel>();
            ProductOperations = new List<ProductOperationModel>();
            Cotitulares = new List<ManagementSearchCotitularesModel>();
        }
    }
}