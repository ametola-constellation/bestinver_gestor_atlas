using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Models.Operation
{
    public class OperationRDCancelModel
    {
        public int IdOperation { get; set; }
        public int IdAccount { get; set; }
        public int IdProduct { get; set; }
        public int IdOperationType { get; set; }
        public string Comments { get; set; }
        public int IdStatus { get; set; }
        public Guid IdRequest { get; set; }
    }
}
