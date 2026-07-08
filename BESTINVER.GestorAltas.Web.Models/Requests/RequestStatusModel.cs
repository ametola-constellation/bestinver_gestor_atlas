using System;
using System.ComponentModel;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class RequestStatusModel
    {
        [DisplayName(ResourceKeys.StatusId)]
        public int Id { get; set; }

        [DisplayName(ResourceKeys.Status)]
        public int IDStatus { get; set; }

        [DisplayName(ResourceKeys.RequestId)]
        public Guid IDRequest { get; set; }

        [DisplayName(ResourceKeys.Comments)]
        public string Comments { get; set; }

        [DisplayName(ResourceKeys.Status)]
        public string StatusName { get; set; }

        [DisplayName(ResourceKeys.StartDate)]
        public DateTime StartDate { get; set; }

        [DisplayName(ResourceKeys.Responsbile)]
        public string Responsible { get; set; }

        [DisplayName(ResourceKeys.StatusDescription)]
        public string StatusDescription { get; set; }

        [DisplayName(ResourceKeys.RequestId)]
        public string IDRequestFriendly { get; set; }
    }
}