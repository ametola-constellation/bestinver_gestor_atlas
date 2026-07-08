using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Models.Requests
{
    public class ProductOperationModel: RequestProductModel
    {
        public List<OperationModel> Operations { get; set; }
    }
}
