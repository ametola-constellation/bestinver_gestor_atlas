using System;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class ManagementSearchCotitularesModel
    {
        public string NIF { get; set; }
        public string Name { get; set; }
        public Guid RequestID { get; set; }
        public string TipoFirma { get; set; }
        public string TipoCotitularidad { get; set; }
        public DateTime RequestStartDate { get; set; }
        public string Mail { get; set; }

        public string Porcentaje { get; set; }
        public string MobilePhoneNumber { get; set; }
        public int RequestApplicantType { get; set; }
        public DateTime Birthday { get; set; }
        public int? RdCode { get; set; }
    }
}