using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class UserRoleModel : SelectItemModel
    {
        [Required]
        public override string Id { get => base.Id; set => base.Id = value; }

        public string Role { get => Description; set => Description = value; }
    }
}