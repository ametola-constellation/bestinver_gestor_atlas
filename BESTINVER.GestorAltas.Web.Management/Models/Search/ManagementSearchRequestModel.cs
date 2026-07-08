using System;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class ManagementSearchRequestModel
    {
        public string AssistedBy { get; set; }
        public string NIF { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public string[] ProductTypes { get; set; }
        public Guid RequestID { get; set; }
        public string LockedBy { get; set; }
        public bool PBCAlerts { get; set; }
        public bool SignAlerts { get; set; }
        public string FriendlyID { get; set; }
        public bool OtherAlerts { get; set; }
        public bool TerroristAlert { get; set; }
        public DateTime RequestStartDate { get; set; }
    }
}