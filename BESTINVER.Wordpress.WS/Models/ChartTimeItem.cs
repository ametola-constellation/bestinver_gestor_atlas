using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.Wordpress.WS.Models
{
    /// <summary>
    /// ChartTimeItem
    /// </summary>
    public class ChartTimeItem
    {
        public string x { get; set; }
        public string y { get; set; }

        /// <summary>
        /// ChartTimeItem
        /// </summary>
        /// <param name="xvalue"></param>
        /// <param name="yvalue"></param>
        public ChartTimeItem(string xvalue, string yvalue)
        {
            this.x = xvalue;
            this.y = yvalue;
        }
    }
}