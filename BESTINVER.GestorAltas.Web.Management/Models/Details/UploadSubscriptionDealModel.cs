using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Management.Models.Details
{
    public class UploadSubscriptionDealModel
    {
        public Guid RequestId { get; set; }
        public string DNI { get; set; }
        [Required(ErrorMessage = "La fecha de Firma es obligatoria")]
        public DateTime? SignDate { get; set; }
        [Required(ErrorMessage = "Es necesario seleccionar un fichero pdf")]
        public IFormFile File { get; set; }
        public string FileName { get; set; }
    }
}