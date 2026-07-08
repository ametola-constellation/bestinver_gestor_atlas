using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class ApplicantSearchListModel : BaseSearchQuery
    {
        public ApplicantSearchListModel()
        {
            RequestAlertType = [];
            NotInStatus = [];
        }

        public List<LockedItemModel> LockedItems { get; set; }

        public int Filtered { get; set; }

        [DisplayName(ResourceKeys.IdSolicitud)]
        public string IDSolicitud { get; set; }

        [DisplayName(ResourceKeys.Dni)]
        public string DNI { get; set; }

        [DisplayName(ResourceKeys.Name)]
        public string Name { get; set; }

        [DisplayName(ResourceKeys.FirstSurname)]
        public string FirstSurname { get; set; }

        [DisplayName(ResourceKeys.SecondSurname)]
        public string SecondSurname { get; set; }

        [DisplayName(ResourceKeys.StartDate)]
        public DateTime? StartDate { get; set; }

        [DisplayName(ResourceKeys.FromPrice)]
        public decimal? FromPrice { get; set; }

        [DisplayName(ResourceKeys.ToPrice)]
        public decimal? ToPrice { get; set; }

        [DisplayName(ResourceKeys.Price)]
        public decimal? Price { get; set; }

        [DisplayName(ResourceKeys.ProductType)]
        public int? ProductType { get; set; }

        [DisplayName(ResourceKeys.Product)]
        public int? Product { get; set; }

        [DisplayName(ResourceKeys.OperationType)]
        public int? OperationType { get; set; }

        [DisplayName(ResourceKeys.Status)]
        public int? Status { get; set; }

        [DisplayName(ResourceKeys.EndDate)]
        public DateTime? EndDate { get; set; }

        [DisplayName(ResourceKeys.TerroristAlerts)]
        public bool? TerroristAlerts { get; set; }

        [DisplayName(ResourceKeys.PBCAlerts)]
        public bool? PBCAlerts { get; set; }

        [DisplayName(ResourceKeys.SignAlerts)]
        public bool? SignAlerts { get; set; }

        [DisplayName(ResourceKeys.IncidenceAlerts)]
        public bool? IncidenceAlerts { get; set; }

        [DisplayName(ResourceKeys.SendDocumentAlerts)]
        public bool? SendDocumentAlerts { get; set; }

        [DisplayName(ResourceKeys.LockedBy)]
        public string LockedBy { get; set; }

        [DisplayName(ResourceKeys.DocStatus)]
        public bool? DocStatus { get; set; }

        [DisplayName(ResourceKeys.SignStatus)]
        public bool? SignStatus { get; set; }

        [DisplayName(ResourceKeys.SignType)]
        [Description("DocumentSignatureType")]
        public int? SignType { get; set; }

        [DisplayName(ResourceKeys.FundStatus)]
        [Description("FundStatusType")]
        public int? FundStatus { get; set; }

        [DisplayName(ResourceKeys.SalesChannel)]
        [Description("SalesChannelType")]
        public int? SalesChannel { get; set; }

        [DisplayName(ResourceKeys.RequestChannel)]
        [Description("RequestChannelType")]
        public int? RequestChannel { get; set; }

        [DisplayName(ResourceKeys.RequestCommercialManager)]
        public string Username { get; set; }

        [DisplayName(ResourceKeys.ManagedByCommercial)]
        public bool? ManagedByCommercial { get; set; }

        public bool? Pending { get; set; }

        [DisplayName(ResourceKeys.RequestApplicantType)]
        public int? RequestApplicantType { get; set; }

        public bool? ValidateUploadDocs { get; set; }

        [DisplayName(ResourceKeys.SendingWay)]
        public int? IdSendingWay { get; set; }

        [Description(ResourceKeys.AlertType)]
        public int[] RequestAlertType { get; set; }

        [DisplayName(ResourceKeys.PersonType)]
        [Description("ApplicantType")]
        public int? PersonType { get; set; }

        [DisplayName(ResourceKeys.NotInStatus)]
        [Description("RequestStatusEnum")]
        public int[] NotInStatus { get; set; }

        [DisplayName(ResourceKeys.RDAccount)]
        public string RDAccount { get; set; }

        [DisplayName(ResourceKeys.Type)]
        public int? Type { get; set; }

        public List<SelectItemModel> OperationTypes { get; set; } = new List<SelectItemModel>();
        public List<SelectItemModel> ProductsTypes { get; set; } = new List<SelectItemModel>();
        public List<SelectItemModel> Products { get; set; } = new List<SelectItemModel>();
        public List<SelectItemModel> RequestStatusTypes { get; set; } = new List<SelectItemModel>();
        public List<SelectItemModel> SalesChannles { get; set; } = new List<SelectItemModel>();
        public List<SelectItemModel> DocumentSignatureTypes { get; set; } = new List<SelectItemModel>();
        public List<SelectItemModel> FundStatuses { get; set; } = new List<SelectItemModel>();
        public List<SelectItemModel> PersonTypes { get; set; } = new List<SelectItemModel>();
        public List<SelectItemModel> RequestApplicantTypes { get; set; } = new List<SelectItemModel>();

        public List<SelectItemModel> RequestAlertTypes { get; set; } = new List<SelectItemModel>();
        public List<SelectItemModel> SignStatuses { get; set; } = new List<SelectItemModel>();
    }
}