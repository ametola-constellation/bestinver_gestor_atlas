using BESTINVER.GestorAltas.Web.Management.ViewModels;
using BESTINVER.GestorAltas.Web.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Models.Details
{
    public class AddressDataModel : AddressData
    {
        [DisplayName(ResourceKeys.UserName)]
        public string LockedUserName { get; set; }

        [DisplayName(ResourceKeys.Email)]
        public string LockedUserEmail { get; set; }

        [DisplayName(ResourceKeys.LockedBy)]
        public bool LockedIsLocked { get; set; }

        [DisplayName(ResourceKeys.StartDate)]
        public DateTime LockedStartDate { get; set; }

        public List<SelectItemModel> Countries { get; set; }

        public List<SelectItemModel> ViaTypes { get; set; }

        [DisplayName(ResourceKeys.DifferentPostalAddress)]
        public bool DifferentPostalAddress { get; set; }

        public bool ShowDifferentPostalAddressCheck { get; set; }

        public string DisabledSaveButton { get; set; } = ActionEnabler.Disable;
        public string Disabled { get; set; } = ActionEnabler.Disable;

        public Guid RequestId { get; set; }
        public string DNI { get; set; }
        public bool ShowOperationChange { get; set; }
    }
}