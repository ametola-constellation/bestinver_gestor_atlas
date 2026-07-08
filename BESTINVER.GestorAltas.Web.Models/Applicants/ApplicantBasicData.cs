using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class ApplicantBasicData
    {
        [DisplayName(ResourceKeys.Dni)]
        [Required]
        public string DNI { get; set; }

        [DisplayName(ResourceKeys.Name)]
        [Required]
        [MaxLength(60)]
        public string Name { get; set; }

        [DisplayName(ResourceKeys.FirstSurname)]
        [MaxLength(50)]
        public string FirstSurname { get; set; }

        [DisplayName(ResourceKeys.SecondSurname)]
        [MaxLength(50)]
        public string SecondSurname { get; set; }

        [DisplayName(ResourceKeys.Email)]
        [EmailAddress]
        public string Email { get; set; }

        [DisplayName(ResourceKeys.MobilePhoneNumber)]
        public string MobilePhoneNumber { get; set; }

        [DisplayName(ResourceKeys.Legal)]
        public bool? Legal { get; set; }

        [DisplayName(ResourceKeys.ApplicantType)]
        [Required]
        public int ApplicantType { get; set; }

        [DisplayName(ResourceKeys.RequestApplicantType)]
        [Required]
        public int RequestApplicantType { get; set; }

        [DisplayName(ResourceKeys.RequestApplicantTypeName)]
        public string RequestApplicantTypeName { get; set; }

        [DisplayName(ResourceKeys.RequestApplicantTypeName)]
        [Required]
        public string IDDocumentType { get; set; }

        public int IdInitialProduct { get; set; }

        public Guid RequestId { get; set; }

        public bool? InformationRight { get; set; }

        public bool? LifeCicleOk { get; set; }

        public string Username { get; set; }

        public int? IdSalesChannel { get; set; }

        public bool? ManagedByCommercial { get; set; }

        public string AgentShippingMail { get; set; }

        [DisplayName(ResourceKeys.PhoneNumber)]
        public string PhoneNumber { get; set; }

        [DisplayName(ResourceKeys.Fax)]
        public string Fax { get; set; }

        public string utm_medium { get; set; }
        public string utm_source { get; set; }
        public string utm_campaign { get; set; }
        public string utm_content { get; set; }
        public string utm_term { get; set; }
        public bool? web { get; set; }
        public int IdRequestChannel { get; set; }
        public bool? isApp { get; set; }

        [DisplayName(ResourceKeys.RdClientCode)]
        public int RdCode { get; set; }
        public bool gdpr { get; set; }
        public bool gdprEvents { get; set; }
        public DateTime gdprDate { get; set; }
        public DateTime gdprEventsDate { get; set; }

        public string CompleteName =>
            string.Join(" ", string.Join(" ", new[] { FirstSurname, SecondSurname, Name }).Split(' ').Where(s => !string.IsNullOrWhiteSpace(s)));
        public string FullName =>
            string.Join(" ", string.Join(" ", new[] { Name, FirstSurname, SecondSurname }).Split(' ').Where(s => !string.IsNullOrWhiteSpace(s)));
    }
}