using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Public.Models.Remediacion
{
    public class RemediacionTestQuestionModel
    {
        public int QuestionId { get; set; }
        public List<RemediacionTestQuestionAnswerModel> AnswerCollection { get; set; }
    }
}
