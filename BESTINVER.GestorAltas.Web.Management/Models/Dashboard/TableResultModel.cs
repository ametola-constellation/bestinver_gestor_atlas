using System;

namespace BESTINVER.GestorAltas.Web.Management.Models.Dashboard
{
    public class TableResultModel
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
        public int? IdRequestStatus { get; set; }
        public int IdOperationType { get; set; }
        public int IdProductType { get; set; }

        public virtual string[] ToTable()
        {
            return [
                RequestID,
                FriendlyID,
                DateTime.SpecifyKind(RequestStartDate, DateTimeKind.Utc).ToString("O"),
                Name,
                NIF,
                Status,
                (string.IsNullOrEmpty(TerroristAlert) ? TerroristAlert : $"<span class='badge badge-danger'>{TerroristAlert}</span>") +
                (string.IsNullOrEmpty(PBCAlerts) ? PBCAlerts : $"<span class='badge badge-danger'>{PBCAlerts}</span>") +
                (string.IsNullOrEmpty(OtherAlerts) ? OtherAlerts : $"<span class='badge badge-warning'>{OtherAlerts}</span>") +
                (string.IsNullOrEmpty(SignAlerts) ? SignAlerts : $"<span class='badge badge-warning'>{SignAlerts}</span>"),
                AssistedBy,
                Product
            ];
        }
    }
}