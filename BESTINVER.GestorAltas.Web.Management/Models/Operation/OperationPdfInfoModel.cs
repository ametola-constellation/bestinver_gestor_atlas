using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Models.Operation
{
    public class OperationPdfInfoModel
    {
        public OperationPdfDetail Info { get; set; }
        public int MyProperty { get; set; }
    }

    public class OperationPdfDetail
    {
        public List<OperationPdfCell> Cells { get; set; }
    }

    public class OperationPdfCell
    {
        public string productName { get; set; }
        public string operationType { get; set; }
        public string amount { get; set; }
    }
}