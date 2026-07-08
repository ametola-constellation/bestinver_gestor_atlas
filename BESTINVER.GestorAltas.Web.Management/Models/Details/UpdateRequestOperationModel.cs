using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class UpdateRequestOperationModel : RequestOperation
    {
        public decimal? MaxAmount { get; set; }
        public decimal? MinAmount { get; set; }
        public Guid RequestId { get; set; }

        [DisplayName("Importe")]
        public string Importe { get; set; }

        [DisplayName("Recibdo")]
        public bool FondoRecibido { get; set; }

        [DisplayName("Fecha recibido")]
        public DateTime  FondoRecibidoFecha { get; set; }
    }
}