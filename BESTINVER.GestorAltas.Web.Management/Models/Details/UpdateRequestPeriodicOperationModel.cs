using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class UpdateRequestPeriodicOperationModel : RequestOperation
    {
        public Guid RequestId { get; set; }
        public string Signer { get; set; }
        public int ProductId { get; set; }
        public int AccountId { get; set; }
    }
}
