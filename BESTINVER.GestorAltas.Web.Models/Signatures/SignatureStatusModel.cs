using System;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class SignatureStatusModel
    {
        [Required(ErrorMessage = "El Identificador del Request es obligatorio")]
        public Guid RequestId { get; set; }

        public string SignerDNI { get; set; }
    }
}