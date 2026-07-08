using System;
using System.ComponentModel;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class RequestModel
    {
        [DisplayName(ResourceKeys.RequestId)]
        public Guid Id { get; set; }
        public string IdRequest { get; set; }
        public int? IdProducto { get; set; }
        public string NombreProducto { get; set; }
        public int? ProductTypeId { get; set; }

        [DisplayName(ResourceKeys.StartDate)]
        public DateTime RequestStartDate { get; set; }

        public int? IdRequestSignature { get; set; }
        public Guid? IdRequestAdviceProduct { get; set; }
        public bool? HasSuitableTest { get; set; }
        public int? IdSendingWay { get; set; }
        public int? IdRequestChannel { get; set; }
        public int? IdSalesChannel { get; set; }
        
        public DateTime? RequestFinishDate { get; set; }

        [DisplayName(ResourceKeys.RDAccount)]
        public string IdCuenta { get; set; }

        [DisplayName(ResourceKeys.IsEmployee)]
        public bool IsEmployee { get; set; }

        public string FoundClass { get; set; }
    }
}