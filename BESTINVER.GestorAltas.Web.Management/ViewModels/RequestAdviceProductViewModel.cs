using BESTINVER.GestorAltas.Web.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace BESTINVER.GestorAltas.Web.Management.ViewModels
{
    public class RequestAdviceProductViewModel : BaseSearchQuery
    {
        public Guid RequestId { get; set; }

        [DisplayName(ResourceKeys.Dni)]
        public string DNI { get; set; }

        [DisplayName(ResourceKeys.Name)]
        public string Name { get; set; }

        [DisplayName(ResourceKeys.FirstSurname)]
        public string FirstSurname { get; set; }

        [DisplayName(ResourceKeys.SecondSurname)]
        public string SecondSurname { get; set; }

        [DisplayName(ResourceKeys.StartDate)]
        public DateTime? StartDate { get; set; }

        [DisplayName(ResourceKeys.EndDate)]
        public DateTime? EndDate { get; set; }

        [DisplayName(ResourceKeys.Status)]
        public int? Status { get; set; }

        [DisplayName(ResourceKeys.SignStatus)]
        public string SignStatus { get; set; }

        [DisplayName(ResourceKeys.RDAccount)]
        public string IdAccount { get; set; }

        public List<SelectItemModel> RequestStatusTypes { get; set; } = new List<SelectItemModel>();

    }
}
