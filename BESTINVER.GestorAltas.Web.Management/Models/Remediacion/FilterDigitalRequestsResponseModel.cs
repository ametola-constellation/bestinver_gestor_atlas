using System;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Management.Models.Remediacion
{
    public class FilterDigitalRequestsResponseModel
    {
        [Display(Name = "RequestId")]
        public string RequestId { get; set; }

        [Display(Name = "DNI")]
        public string DNI { get; set; }

        [Display(Name = "RDCliente")]
        public string RDCliente { get; set; }

        [Display(Name = "Email")]
        public string Email { get; set; }

        [Display(Name = "Created")]
        public DateTime Created { get; set; }

        [Display(Name = "Name")]
        public string Name { get; set; }

        public virtual string[] ToTable()
        {
            return [
                RequestId,
                DNI,
                RDCliente,
                Email,
                Created.ToString("O"),
                Name,
            ];
        }
    }
}