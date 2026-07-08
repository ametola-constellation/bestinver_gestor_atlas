using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class ApplicantPersonalData
    {
        [DisplayName(ResourceKeys.Birthday)]
        public DateTime? Birthday { get; set; }

        [DisplayName(ResourceKeys.Gender)]
        [Required]
        public int? Gender { get; set; }

        [DisplayName(ResourceKeys.Nacionality)]
        public int? Nacionality { get; set; }

        [DisplayName(ResourceKeys.Country)]
        public int? Country { get; set; }

        [DisplayName(ResourceKeys.BornPlace)]
        public string BornPlace { get; set; }

        [DisplayName(ResourceKeys.SpanishResident)]
        [Required]
        public bool IsResident { get; set; }

        [DisplayName(ResourceKeys.DocumentExpirationDate)]
        public DateTime? IDDocumentExpirationDate { get; set; }

        [DisplayName(ResourceKeys.DocumentIsPermanent)]
        public bool IDDocumentIsPermanent { get; set; }

        [DisplayName(ResourceKeys.PhoneNumber)]
        public string PhoneNumber { get; set; }

        [DisplayName(ResourceKeys.Fax)]
        public string Fax { get; set; }

        [DisplayName(ResourceKeys.CompanyPercentage)]
        public decimal CompanyPercentage { get; set; }

        public int? FiscalCountry { get; set; }
        public string FiscalNumber { get; set; }
        public string UsaFiscalNumber { get; set; }
    }
}