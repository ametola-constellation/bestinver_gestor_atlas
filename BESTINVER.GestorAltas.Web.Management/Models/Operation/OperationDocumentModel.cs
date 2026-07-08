using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Models.Operation
{
    public class OperationDocumentModel
    {
        public OperationDocumentModel()
        {
            Documents = new List<OperationDocument>();
        }

        public string Dni { get; set; }
        public string Name { get; set; }
        public IEnumerable<OperationDocument> Documents { get; set; }
    }

    public class OperationDocument
    {
        public string Name { get; set; }
        public string SignatureStatus { get; set; }
        public string Url { get; set; }
    }
}
