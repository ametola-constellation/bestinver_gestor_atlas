using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class TestUserModel
    {
        [Required]
        public string DNI { get; set; }

        public string Name { get; set; }
        public string FirstSurname { get; set; }
        public string SecondSurname { get; set; }
        public UserRoleModel Role { get; set; }
    }
}