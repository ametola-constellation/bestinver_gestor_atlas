using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Public.Models.Register
{
    public class ProductOperationModel
    {
        [Required(ErrorMessage = "El identificador del producto es obligatorio")]
        public int IdProduct { get; set; }

        public String ProductName { get; set; }

        public List<OperationModel> Operations { get; set; }
    }
}