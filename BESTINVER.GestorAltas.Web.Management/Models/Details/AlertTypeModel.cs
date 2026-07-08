using BESTINVER.GestorAltas.Web.Models;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Management.Models.Details
{
    public class AlertTypeModel : SelectItemModel<int, string>
    {
        [Required]
        public override int Id { get; set; }

        [Required]
        public override string Description { get; set; }
    }
}