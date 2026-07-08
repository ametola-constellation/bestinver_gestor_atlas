using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Models.Movements
{
    public class MovementsModel
    {
        public int Id { get; set; }

        [StringLength(500)]
        [Required]
        public string Concept { get; set; }

        [Required]
        public DateTime? OperationDate { get; set; }

        [Required]
        public DateTime? ValuationDate { get; set; }

        [Required]
        public double Amount { get; set; }

        [StringLength(500)]
        [Required]
        public string IBAN { get; set; }

        [StringLength(500)]
        [Required]
        public string ProductName { get; set; }
        public string UserName { get; set; }
        public int RowInExcel { get; set; }
    }
}
