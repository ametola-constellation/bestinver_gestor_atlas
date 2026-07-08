using System.ComponentModel;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class ApplicantRoleModel : SelectItemModel
    {
        [DisplayName(ResourceKeys.ApplicantRoleId)]
        public override string Id { get => base.Id; set => base.Id = value; }

        [DisplayName(ResourceKeys.ApplicantRoleName)]
        public override string Description { get => base.Description; set => base.Description = value; }
    }
}