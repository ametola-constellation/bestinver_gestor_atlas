using BESTINVER.GestorAltas.Web.Models.Requests;
using System;
using System.ComponentModel;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class RequestAlertModel
    {
        public virtual int Id { get; set; }

        [DisplayName(ResourceKeys.AlertType)]
        public virtual int? AlertTypeId { get; set; }

        [DisplayName(ResourceKeys.AlertStatus)]
        public virtual int? AlertStatus { get; set; }

        [DisplayName(ResourceKeys.AlertDetails)]
        public virtual string Details { get; set; }

        public virtual Guid? RequestId { get; set; }

        [DisplayName(ResourceKeys.Comments)]
        public virtual string Comments { get; set; }

        [DisplayName(ResourceKeys.AlertType)]
        public virtual string AlertType { get; set; }

        [DisplayName(ResourceKeys.StartDate)]
        public virtual DateTime? StartDate { get; set; }

        [DisplayName(ResourceKeys.EndDate)]
        public virtual DateTime? EndDate { get; set; }

        [DisplayName(ResourceKeys.Responsbile)]
        public virtual string Responsbile { get; set; }

        public int? IdAria { get; set; }

        public bool AllowSolve {
            get => !(this.AlertTypeId == (int)RequestAlertTypes.AlertaPendienteValidarJuridico && !this.EndDate.HasValue) && this.AlertTypeId != (int)RequestAlertTypes.AlertaPendienteGenerarDocumentacion && !IdAria.HasValue;
        }
    }
}