using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Public.Models.Register
{
    public class PersonalDataViewModel
    {
        public string UserName { get; set; }
        public string UserMail { get; set; }
        public string ProductID { get; set; }
        public string ProductTypeID { get; set; }
        public List<ProductTypeModel> ProductTypes { get; set; }
        public List<ProductModel> Products { get; set; }
        public string Modal { get; set; }
        public string ProductTypePredef { get; set; }
        public ProductModel Product { get; set; }
        public int SessionTimeout { get; set; }
        public string ProfitabilityDisclaimer { get; set; }
        public string utm_medium { get; set; }
        public string utm_source { get; set; }
        public string utm_campaign { get; set; }
        public string utm_content { get; set; }
        public string utm_term { get; set; }
        public bool IsMobile { get; set; }
        public MasterDataModel MasterData { get; set; }
        public string LogRocketAccount { get; set; }
        public string ProfitabilityDate { get; set; }
        public string ProfitabilityDateFIL { get; set; }
        public bool LogRocketEnabled { get; set; }
    }
}