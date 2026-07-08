using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Models.Movements
{
    public class MovementsResult
    {
        public DateTime? OperationDate { get; set; }
        public int ProductId { get; set; } 
        public SaveMovementsResponse Result { get; set; }
    }
}
