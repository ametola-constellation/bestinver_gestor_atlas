using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class CancelRequestModel
    {
        [Required(ErrorMessage = "Hay que selecionar un valor para {0}")]
        [DisplayName("Motivo")]
        public string Comments { get; set; }

        [DisplayName("Espeficar el motivo")]
        public string OtherComments { get; set; }

        [RequiredGuid]
        public Guid RequestId { get; set; }

        public SelectList Reasons

        => new SelectList(new List<SelectItemModel> {
            new SelectItemModel {Id = 1.ToString(), Description="Ya no desea invertir"},
            new SelectItemModel {Id = 2.ToString(), Description="Invertirá, pero en otra compañía"},
            new SelectItemModel {Id = 3.ToString(), Description="Realizará el alta en otro momento"},
            new SelectItemModel {Id = 4.ToString(), Description="El traspaso no lo realiza porque le cobran comisión"},
            new SelectItemModel {Id = 5.ToString(), Description="El traspaso no lo realiza porque al final se queda en la otra entidad"},
            new SelectItemModel {Id = 6.ToString(), Description="Descontento con el proceso de alta"},
            new SelectItemModel {Id = 7.ToString(), Description="Otros motivos"}
        }, nameof(SelectItemModel.Description), nameof(SelectItemModel.Description));
    }
}