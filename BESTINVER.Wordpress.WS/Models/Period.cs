using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.Wordpress.WS.Models
{
    public class Period
    {
        public Period(string Key, string EsValue, string EnValue)
        {
            this.Key = Key;
            this.EsValue = EsValue;
            this.EnValue = EnValue;
        }

        public string Key { get; set; }
        public string EsValue { get; set; }
        public string EnValue { get; set; }
    }
}
