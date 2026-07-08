using BESTINVER.GestorAltas.Web.Models;
using System;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Public.Models.Remediacion
{
    public class RemediacionQuestionData: RemediacionModel
    {
        public List<QuestionAnswerModel> Answers { get; set; }
        public string KnowledgeFile { get; set; }
    }
}
