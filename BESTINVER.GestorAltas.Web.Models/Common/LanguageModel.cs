using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class LanguageModel
    {
        [Required]
        public string Culture { get; set; }

        [Required]
        public string ReturnUrl { get; set; }
    }
}