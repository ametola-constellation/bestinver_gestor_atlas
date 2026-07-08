using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Models.Movements
{
    public class SaveMovements
    {
        public DateTime OperationDate { get; set; }

        public DateTime ValuationDate { get; set; }

        public string Concept { get; set; }

        public string Amount { get; set; }

        public string UserName { get; set; }

        public string IBAN { get; set; }

        public string ProductName { get; set; }
        public int RowInExcel { get; set; }
    }
}
