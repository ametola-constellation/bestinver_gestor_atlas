namespace BESTINVER.GestorAltas.Web.Public.Models.Register
{
    public class ProductModel
    {
        public int Id { get; set; }
        public int ProductTypeId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Profitability { get; set; }
        public string ProfitabilityDateText { get; set; }
        public int idOperation { get; set; }
        public decimal AdultMax { get; set; }
        public decimal AdultMin { get; set; }
        public decimal MinorMax { get; set; }
        public decimal MinorMin { get; set; }
        public decimal DisabledMax { get; set; }
        public decimal DisabledMin { get; set; }
        public string IBAN { get; set; }
        public string AccountNumber { get; set; }
        public int OrderToShow { get; set; }
        public int? FromAge { get; set; }
        public int? ToAge { get; set; }
        public bool ComplexProduct { get; set; }
        public int RDCode { get; set; }
        public int? Family { get; set; }
        public decimal EmployeeMin { get; set; }
        public decimal EmployeeMax { get; set; }
        public int? SubFamilyProductId { get; set; }
    }
}