using System;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Public.Models.Register
{
    public class QuestionModel : IEquatable<QuestionModel>
    {
        public int ApplicantType { get; set; }
        public int RequestType { get; set; }
        public int TestType { get; set; }
        public int IdQuestion { get; set; }
        public int? QuestionOrder { get; set; }
        public string Question { get; set; }
        public string QuestionLabel { get; set; }
        public bool? AllowMultipleAnswers { get; set; }
        public bool? AllowNoAnswer { get; set; }
        public int? QuestionGroup { get; set; }
        public List<AnswerModel> Answers { get; set; }
        public string ToolTip { get; set; }
        public string ErrorMessage { get; set; }
        public string Type { get; set; }
        public int? FamilyProductId { get; set; }
        public int? SubFamilyProductId { get; set; }

        public bool Equals(QuestionModel other)
        {
            if (other is null)
            {
                return false;
            }

            return this.IdQuestion == other.IdQuestion;
        }
        
        public override bool Equals(object obj) => Equals(obj as QuestionModel);
        public override int GetHashCode() => (IdQuestion).GetHashCode();
    }
}