using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Models
{
    public class ChangeRequestStatusModel
    {
        public string Comments { get; set; }
        public string Responsible { get; set; }

        [RequiredGuid]
        public Guid RequestId { get; set; }

        public Dictionary<int, DateTime> OperationsDate { get; set; }
        public string RDIdCuenta { get; set; }
        public bool NoRestrictions { get; set; }
        public bool FromManagement { get; set; }
        public int CompromiseId { get; set; }
    }
}