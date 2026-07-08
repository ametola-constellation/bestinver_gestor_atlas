using System;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class SignedRequestStatusDocumentModel
    {
        public string DocumentName { get; set; }
        public string DocumentUrl { get; set; }
        public Uri DocumentUrlFirmado { get; set; }
        public DateTime FechaFirma { get; set; }
        public bool Firmado { get; set; }
        public int Id { get; set; }
        public Guid IDRequest { get; set; }
        public string Participe { get; set; }
        public string ParticipeDNI { get; set; }
        public bool Recibido { get; set; }
        public int TipoFirma { get; set; }
        public bool Valido { get; set; }
    }
}