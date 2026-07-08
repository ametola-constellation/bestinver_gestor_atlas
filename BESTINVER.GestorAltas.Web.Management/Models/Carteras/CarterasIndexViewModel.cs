using System;
using System.Collections.Generic;
using System.Linq;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class CarterasIndexViewModel
    {
        public ExcelLoadModel ExcelLoadResult { get; set; }
        public IEnumerable<IGrouping<DateTime, CarterasModel>> Carteras { get; set; }
    }
}