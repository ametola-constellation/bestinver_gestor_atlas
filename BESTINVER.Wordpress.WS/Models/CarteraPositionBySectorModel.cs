using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.Wordpress.WS.Models
{
    public class CarteraPositionBySectorModel
    {
        public string SectorName { get; set; }
        public IEnumerable<InstrumentPositionModel> InstrumentPositionList { get; set; }
    }
}
