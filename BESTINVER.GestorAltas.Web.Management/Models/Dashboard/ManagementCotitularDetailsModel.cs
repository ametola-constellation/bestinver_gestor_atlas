using BESTINVER.GestorAltas.Web.Models;
using System.ComponentModel;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class ManagementCotitularDetailsModel : ManagementRequestModel
    {
        [DisplayName("Relación con el titular")]
        public string TitularRelationship { get; set; }

        [DisplayName("Porcentaje en la empresa")]
        public string Porcentaje { get; set; }

        public ManagementCotitularDetailsModel()
        {
            Data = new ApplicantData
            {
                BasicData = new ApplicantBasicData(),
                PersonalData = new ApplicantPersonalData()
            };
            PostalAddress = new AddressData();
            FiscalAddress = new AddressData();

            Request = new RequestModel();
        }
    }
}