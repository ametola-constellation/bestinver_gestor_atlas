namespace BESTINVER.GestorAltas.MicroservicesProxy.Models
{
    public class AdviceProductDocumentParameters
    {
        public string RequestID { get; set; }
        public string DocumentNumber { get; set; }
        public string IdAccount { get; set; }
        public bool? Suitable { get; set; }
        public int RequestStatusId { get; set; }
        public string CustomerFullName { get; set; }
    }
}
