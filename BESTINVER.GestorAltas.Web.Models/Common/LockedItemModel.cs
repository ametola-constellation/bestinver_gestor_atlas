using System;
using System.ComponentModel;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class LockedItemModel
    {
        [DisplayName(ResourceKeys.UserName)]
        public string LockedUserName { get; set; }

        [DisplayName(ResourceKeys.Email)]
        public string LockedUserEmail { get; set; }

        [DisplayName(ResourceKeys.LockedBy)]
        public bool LockedIsLocked { get; set; }

        [DisplayName(ResourceKeys.StartDate)]
        public DateTime LockedStartDate { get; set; }
    }
}