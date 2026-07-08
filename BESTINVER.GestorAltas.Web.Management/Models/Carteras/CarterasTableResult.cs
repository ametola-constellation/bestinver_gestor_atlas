using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class CarterasTableResult
    {
        public IEnumerable<int> Ids { get; set; }
        public string Key { get; set; }
        public string Count { get; set; }

        public bool Enabled { get; set; }
    }
}