using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Management.Models.Security
{
    public class RolePermissionsModel 
    {
        [Required]
        public string RoleName { get; set; }

        [Required]
        public  string Type = "middle-office-permission";

        [Required]
        public string Name { get; set; }

        public bool IsActive { get; set; }
    }
}