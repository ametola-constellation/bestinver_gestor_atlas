using BestInver.WebPrivada.Shared.Models.Microservices.Alerts;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class CreateAlertModel : RequestAlertModel
    {
        [BindNever]
        public override string Responsbile { get; set; }

        [Required]
        public override string Details { get => base.Details; set => base.Details = value; }

        [Required]
        public override int? AlertTypeId { get => base.AlertTypeId; set => base.AlertTypeId = value; }

        public SelectList AlertTypes { get; set; }
    }
}