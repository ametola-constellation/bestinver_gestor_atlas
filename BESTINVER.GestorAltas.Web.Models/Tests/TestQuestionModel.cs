using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class TestQuestionModel
    {
        [Required]
        public int Id { get; set; }

        public string Text { get; set; }
        public int TestType { get; set; }
    }
}