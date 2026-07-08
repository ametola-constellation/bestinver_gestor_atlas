using BESTINVER.GestorAltas.Web.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Public.Models.Register
{
    public class RegisterData
    {
        public List<ApplicantData> Applicants { get; set; }
        public List<ProductOperationModel> OperationData { get; set; }

        [Required(ErrorMessage = "El tipo de firma es obligatorio")]
        public int SignatureType { get; set; }

        [Required(ErrorMessage = "El ID del alta es obligatorio")]
        public Guid requestID { get; set; }
        public string UserName { get; set; }
        public string RefundAccountNumber { get; set; }
        public DateTime? AccountNumberAcceptanceDate { get; set; }

    }
}