using System.ComponentModel;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class UserSearchModel
    {
        [DisplayName(ResourceKeys.UserId)]
        public int UserId { get; set; }

        [DisplayName(ResourceKeys.UserName)]
        public string UserName { get; set; }

        [DisplayName(ResourceKeys.Name)]
        public string Name { get; set; }

        [DisplayName(ResourceKeys.FirstSurname)]
        public string Surname1 { get; set; }

        [DisplayName(ResourceKeys.SecondSurname)]
        public string Surname2 { get; set; }

        [DisplayName(ResourceKeys.Dni)]
        public string DocumentId { get; set; }

        public JQueryDataTableParamModel Filter { get; set; }
    }
}