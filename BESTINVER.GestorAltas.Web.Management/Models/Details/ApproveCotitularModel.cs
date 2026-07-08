using BESTINVER.GestorAltas.Web.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class ApproveCotitularModel : RequestAlertModel
    {
        [Required]
        public override string Comments { get => base.Comments; set => base.Comments = value; }

        [Required]
        public override int? AlertStatus { get => base.AlertStatus; set => base.AlertStatus = value; }
    }
}
