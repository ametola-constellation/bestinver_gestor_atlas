using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Public.Models
{
    public class CompleteProcessModel
    {
        [Required(ErrorMessage = "El Identificador del Request es obligatorio")]
        public string RequestId { get; set; }

        public int IdSendingWay { get; set; }
        public List<string> Messages { get; set; }
    }
}