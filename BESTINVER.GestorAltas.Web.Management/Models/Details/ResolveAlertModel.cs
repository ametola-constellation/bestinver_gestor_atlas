using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class ResolveAlertModel : RequestAlertModel
    {
        [Required]
        public override int Id { get; set; }

        [Required]
        public override int? AlertStatus { get; set; }

        [Required]
        public override Guid? RequestId { get; set; }

        [Required]
        [DataType(DataType.Text)]
        public override string Comments { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public override DateTime? StartDate { get; set; }

        [BindNever]
        [DataType(DataType.DateTime)]
        public override DateTime? EndDate { get; set; }

        [DataType(DataType.Text)]
        [BindNever]
        public override string Responsbile { get; set; }

        [Required]
        public override int? AlertTypeId { get; set; }
        
        public SelectList AlertStatuses
          => new SelectList(new List<SelectItemModel> {
                new SelectItemModel {Id = ((int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.AlertStatus.Accepted).ToString(), Description= "Aceptada"},
                new SelectItemModel {Id = ((int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.AlertStatus.Denied).ToString(), Description="Denegada (esta acción cancela la petición)"}
          }, nameof(SelectItemModel.Id), nameof(SelectItemModel.Description));
    }
}