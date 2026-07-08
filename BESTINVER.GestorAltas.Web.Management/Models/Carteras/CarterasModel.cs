using System;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class CarterasModel
    {
        public int Id { get; set; }

        [StringLength(10)]
        [Required]
        public string Cartera { get; set; }

        [Required]
        public DateTime? Fecha { get; set; }

        [StringLength(10)]
        public string Instrumento { get; set; }

        [StringLength(50)]
        public string Efectivo { get; set; }

        [StringLength(10)]
        [Required]
        public string TipoRegistro { get; set; }

        [StringLength(10)]
        [Required]
        public string TipoValor { get; set; }

        [StringLength(50)]
        [Required]
        public string Diversificacion { get; set; }

        [StringLength(100)]
        [Required]
        public string NombreInstrumento { get; set; }

        [StringLength(50)]
        public string SectorInstrumento { get; set; }

        [StringLength(50)]
        public string SubsectorInstrumento { get; set; }

        [StringLength(50)]
        public string PaisInstrumento { get; set; }

        [StringLength(50)]
        public string ZonaGeograficaPaisInstrumento { get; set; }

        public bool? Habilitado { get; set; }
    }
}