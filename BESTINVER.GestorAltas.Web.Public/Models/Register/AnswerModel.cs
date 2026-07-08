using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Public.Models.Register
{
    public class AnswerModel
    {
        public int IdAnswer { get; set; }
        public string Answer { get; set; }
        public int? DependentQuestion { get; set; }
        public bool ExtendedAnswer { get; set; }
        public bool NotMultiAnswer { get; set; }
        public int? AnswerOrder { get; set; }
        public List<AnswerModel> DependetAnswers { get; set; }
        public string Type { get; set; }
        public bool NoAnswer { get; set; }
    }
}