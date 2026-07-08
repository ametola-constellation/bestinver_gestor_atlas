using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Models.Operation
{
    public class OperationSearchRequestModel
    {
        public string RequestID { get; set; }
        public string FriendlyID { get; set; }
        public DateTime RequestStartDate { get; set; }
        public string Name { get; set; }
        public string NIF { get; set; }
        public string Status { get; set; }
        public string TerroristAlert { get; set; }
        public string PBCAlerts { get; set; }
        public string OtherAlerts { get; set; }
        public string SignAlerts { get; set; }
        public string AssistedBy { get; set; }
        public string RDCode { get; set; }
        public string Product { get; set; }
        public string Amount { get; set; }
        public string Comments { get; set; }
        public string OperationType { get; set; }
        public string IdRequestStatus { get; set; }
        public string IdOperationType { get; set; }
        public string IdProductType { get; set; }
        public DateTime? SignedDate { get; set; }
        public bool? LifeCicleOk { get; set; }
        public bool? LifeCycleChanged { get; set; }
        public string IdOperation { get; set; }
        public string IdProduct { get; set; }
        public bool? IsForeignAccount { get; set; }
        public DateTime? InitialPeriodicDate { get; set; }
        public string ExternalCode { get; set; }
    }
}