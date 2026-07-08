using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Models.Movements
{
    public class MovementsTemporal
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        public DateTime OperationDate { get; set; }

        [Required]
        public DateTime ValuationDate { get; set; }

        [Required]
        public string Concept { get; set; }

        [Required]
        public string Amount { get; set; }

        [Required]
        public string UserName { get; set; }

        [Required]
        public string IdProduct { get; set; }

        public virtual IEnumerable<OperationMovementsTemporal> OperationMovement { get; set; }
        public int RowInExcel { get; set; }

    }
}
