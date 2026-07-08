using BESTINVER.GestorAltas.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Public.Models.Register
{
    public class CheckConvenienceData
    {
        public int ProductId { get; set; }
        public IEnumerable<QuestionAnswerModel> Answers { get; set; }
    }
}
