using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class CarteraUpdateModel
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Cartera { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        public string Instrumento { get; set; }

        public string Efectivo { get; set; }

        public string TipoRegistro { get; set; }

        public string TipoValor { get; set; }

        public string Diversificacion { get; set; }

        public string NombreInstrumento { get; set; }

        public string SectorInstrumento { get; set; }

        public string SubsectorInstrumento { get; set; }

        public string PaisInstrumento { get; set; }

        public string ZonaGeograficaPaisInstrumento { get; set; }

        [Required]
        public bool Habilitado { get; set; }
    }
}