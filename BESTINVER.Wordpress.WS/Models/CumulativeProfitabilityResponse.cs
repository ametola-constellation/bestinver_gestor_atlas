using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.Wordpress.WS.Models
{
    /// <summary>
    /// ChartTimeItem
    /// </summary>
    public class CumulativeProfitabilityResponse
    {
        public string Time { get; set; }
        public string Profitability { get; set; }

        /// <summary>
        /// ChartTimeItem
        /// </summary>
        /// <param name="time"></param>
        /// <param name="profitability"></param>
        public CumulativeProfitabilityResponse(string time, string profitability)
        {
            this.Time = time;
            this.Profitability = profitability;
        }
    }
}