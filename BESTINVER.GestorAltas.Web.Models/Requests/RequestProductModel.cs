using System;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class RequestProductModel
    {
        public int? ToAge { get; set; }
        public int? FromAge { get; set; }
        public bool? Show { get; set; }
        public bool? Comercializable { get; set; }
        public int OrderToShow { get; set; }
        public string RDCodeGestora { get; set; }
        public string RDCodeTraspasoPlan { get; set; }
        public string RDCodeFondoTraspaso { get; set; }
        public string RDCodePlan { get; set; }
        public string ISIN { get; set; }
        public string TER { get; set; }
        public string ManagementCommission { get; set; }
        public string UseDerivatives { get; set; }
        public string RecommendedInvestmentPeriod { get; set; }
        public string ProfitabilityDateText { get; set; }
        public string Category { get; set; }
        public string PER { get; set; }
        public string RevaluationPotential { get; set; }
        public int RDCode { get; set; }
        public string IBAN { get; set; }
        public string AccountNumber { get; set; }
        public decimal? DisabledMin { get; set; }
        public decimal? DisabledMax { get; set; }
        public decimal? MinorMin { get; set; }
        public decimal? MinorMax { get; set; }
        public decimal? AdultMin { get; set; }
        public decimal? AdultMax { get; set; }
        public string Profitability { get; set; }
        public string Description { get; set; }
        public string ProductName { get; set; }
        public int IdProduct { get; set; }
        public DateTime? StartDate { get; set; }
        public RequestProductTypeModel ProductType { get; set; }
    }
}