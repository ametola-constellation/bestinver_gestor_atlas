using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class ApplicantData
    {
        public ApplicantBasicData BasicData { get; set; }
        public ApplicantPersonalData PersonalData { get; set; }
        public List<AddressData> ContactData { get; set; }

        //[Required(ErrorMessage = "Las respuestas al Test son obligatorias")]
        public List<QuestionAnswerModel> Answers { get; set; }
    }
}