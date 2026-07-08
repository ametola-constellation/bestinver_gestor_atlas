using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class OperationModel
    {
        public int Id { get; set; }

        [Display(Name = "Tipo de operación")]
        [Required(ErrorMessage = "El tipo de operación es obligatorio")]
        public int IdOperationType { get; set; }

        [Display(Name = "Importe")]
        public decimal? Amount { get; set; }

        [Display(Name = "Forma de Pago")]
        public int? IdWayToPay { get; set; }

        public bool FondoType { get; set; }

        [MaxLength(50, ErrorMessage = "La longitud máxima permitida del código del Fondo de 50 caracteres")]
        public string FondoCode { get; set; }

        [MaxLength(250, ErrorMessage = "La longitud máxima permitida del nombre del Fondo de 250 caracteres")]
        public string FondoName { get; set; }

        [MaxLength(50, ErrorMessage = "La longitud máxima permitida del ISIN del Fondo es de 50 caracteres")]
        public string FondoISIN { get; set; }

        [MaxLength(50, ErrorMessage = "La longitud máxima del código de la gestora es de 50 caracteres")]
        public string ManagerCode { get; set; }

        [MaxLength(250, ErrorMessage = "La longitud máxima permitida del nombre del Plan de 250 caracteres")]
        public string PlanName { get; set; }

        [MaxLength(50, ErrorMessage = "La longitud máxima permitida del código del Plan de 50 caracteres")]
        public string PlanCode { get; set; }

        [MaxLength(250, ErrorMessage = "La longitud máxima de la gestora es de 250 caracteres")]
        public string ManagerName { get; set; }

        public int IdTransferType { get; set; }
        public string ParticipantAccount { get; set; }
        public bool Before2007 { get; set; }
        public bool After2007 { get; set; }
        public decimal? MonthlyAmount { get; set; }
        public string IBAN { get; set; }
        public string OperationDisplayName { get; set; }
        public string OperationDisplayWayToPay { get; set; }

        public bool? FundReceived { get; set; }
        public DateTime? FundReceivedDate { get; set; }
        public string PayerName { get; set; }
        public string ParOpe { get; set; }
        public int? InitialDay { get; set; }
        public int? InitialMonth { get; set; }
        public int? InitialYear { get; set; }
        public int? IdPeriodicity { get; set; }
        public decimal? MinorMax { get; set; }
        public decimal? MinorMin { get; set; }
        public decimal? DisabledMax { get; set; }
        public decimal? DisabledMin { get; set; }
        public decimal? AdultMax { get; set; }
        public decimal? AdultMin { get; set; }
        [Display(Name = "Coódigo Externo")]
        public string ExternalCode { get; set; }
    }
}