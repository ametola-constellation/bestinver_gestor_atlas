using BESTINVER.GestorAltas.Web.Models;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class ProductOperationModel : RequestProductModel
    {
        public List<OperationModel> Operations { get; set; }
    }
}