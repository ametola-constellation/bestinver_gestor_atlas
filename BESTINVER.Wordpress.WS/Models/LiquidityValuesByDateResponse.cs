using System;

namespace BESTINVER.Wordpress.WS.Models
{
    /// <summary>
    /// AllLiquidityProfitabilityDateLastYearResponse
    /// </summary>
    public class LiquidityValuesByDateResponse
    {
        public string Code { get; set; }

        public string RDCode { get; set; }

        public string Name { get; set; }

        public string VL { get; set; }

        public string VD { get; set; }

        public string VA { get; set; }

        public string Date { get; set; }

        public string Patrimonio { get; set; }

        public string FamiliaType { get; set; }

        public string FamiliaNombre { get; set; }

        public int FamiliaOrden { get; set; }

        public int ProductOrder { get; set; }
    }
}