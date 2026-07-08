using System;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class TestModel
    {
        [Required]
        public Guid RequestId { get; set; }

        public TestUserModel User { get; set; }
        public TestAnswerModel Answer { get; set; }
        public TestQuestionModel Question { get; set; }
    }
}