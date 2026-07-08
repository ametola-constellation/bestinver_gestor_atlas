using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Public.Models.Register
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

        public int? IdTransferType { get; set; }
        public string ParticipantAccount { get; set; }
        public bool Before2007 { get; set; }
        public bool After2007 { get; set; }
        public decimal? MonthlyAmount { get; set; }
        public string IBAN { get; set; }
        public string AccountNumber { get; set; }
        public String OperationDisplayName { get; set; }
        public String OperationDisplayWayToPay { get; set; }

        public bool? FundReceived { get; set; }
        public DateTime? FundReceivedDate { get; set; }
        public String PayerName { get; set; }
        public String ParOpe { get; set; }
        public int? InitialMonth { get; set; }
        public int? InitialYear { get; set; }
        public int? IdPeriodicity { get; set; }
        public bool? IsEmployee { get; set; }
    }
}