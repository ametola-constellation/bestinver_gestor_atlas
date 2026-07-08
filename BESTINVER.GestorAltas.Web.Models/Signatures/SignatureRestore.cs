using System;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class SignatureRestore
    {
        [Required(ErrorMessage = "El Identificador del Request es obligatorio")]
        public string RequestId { get; set; }

        [Required(ErrorMessage = "El DNI del aplicante es obligatorio")]
        public string Dni { get; set; }

        public string CompleteName { get; set; }
        public bool IsMinor { get; set; }
        public DateTime Birthday { get; set; }
    }
}