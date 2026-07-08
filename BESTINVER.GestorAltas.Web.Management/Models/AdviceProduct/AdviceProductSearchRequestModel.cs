using System;

namespace BESTINVER.GestorAltas.Web.Management.Models.AdviceProduct
{
    public class AdviceProductSearchRequestModel
    {
        public string RequestID { get; set; }
        public DateTime RequestStartDate { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public string IdRequestStatus { get; set; }
        public DateTime? SignedDate { get; set; }
        public bool? Suitable { get; set; }
        public string IdAccount { get; set; }
        public string DocumentNumber { get; set; }
    }
}
