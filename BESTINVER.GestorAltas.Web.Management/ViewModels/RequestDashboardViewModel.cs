using BESTINVER.GestorAltas.Web.Management.Models.Operation;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace BESTINVER.GestorAltas.Web.Management.ViewModels
{
    public class RequestDashboardViewModel : BaseSearchQuery
    {
        public Guid RequestId { get; set; }
        public bool? Filter { get; set; }

        [DisplayName(ResourceKeys.RDAccount)]
        public string RDCode { get; set; }

        [DisplayName(ResourceKeys.Price)]
        public decimal? Price { get; set; }

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

        [DisplayName(ResourceKeys.RequestSignedDate)]
        public DateTime? SignedDate { get; set; }

        [DisplayName(ResourceKeys.SalesChannel)]
        public int? SalesChannel { get; set; }
        public bool? ExcludeSalesChannel { get; set; }

        public List<SelectListItem> Products { get; set; }
        public List<SelectListItem> ProductTypes { get; set; }
        public List<SelectListItem> OperationTypes { get; set; }
        public List<SelectListItem> RequestStatusTypes { get; set; }

        [DisplayName("Nombre documento")]
        public string Document { get; set; }

        [DisplayName("Ordenante")]
        public string PayerName { get; set; }

        [DisplayName("Adhiere ciclo de vida")]
        public bool? LifeCicleOk { get; set; }

        [DisplayName("Cambia ciclo de vida")]
        public bool? LifeCycleChanged { get; set; }

        
        [DisplayName("Fecha de inicio operación periódica")]
        public DateTime? InitialPeriodicDate { get; set; }

        [DisplayName("Código externo")]
        public string ExternalCode { get; set; }

        public IEnumerable<int> NotInStatus { get; set; }

        [DisplayName("ID Operación")]
        public string IdOperation { get; set; }
    }
}