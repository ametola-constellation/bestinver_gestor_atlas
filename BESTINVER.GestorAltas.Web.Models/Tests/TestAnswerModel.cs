using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class TestAnswerModel
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Text { get; set; }

        public string OtherAnswer { get; set; }
    }
}