using BESTINVER.GestorAltas.Web.Management.ViewModels;
using BESTINVER.GestorAltas.Web.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class TitularContactDataModel : LockedItemModel
    {
        public Guid RequestId { get; set; }

        [DisplayName(ResourceKeys.Dni)]
        [Required]
        public string DNI { get; set; }

        [DisplayName(ResourceKeys.MobilePhoneNumber)]
        [UniqueMobilePhone(1)]
        public string MobilePhoneNumber { get; set; }

        [DisplayName(ResourceKeys.PhoneNumber)]
        public string PhoneNumber { get; set; }

        [DisplayName(ResourceKeys.Email)]
        [EmailAddress(ErrorMessage = "Email incorrecto")]
        public string Email { get; set; }

        public string InvalidPhones { get; set; }

        public string DisabledSaveButton { get; set; } = ActionEnabler.Disable;
        public string Disabled { get; set; } = ActionEnabler.Disable;
        public bool IsRequiredMobilePhone { get; set; } = true;
        public bool IsRequiredEmail { get; set; } = true;
        public bool ShowOperationChange { get; set; }
    }
}