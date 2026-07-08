using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Models.Applicants
{
    public class DNIData
    {
        [Required]
        public Guid RequestId { get; set; }
        public string AnversoDni { get; set; }
        public string ReversoDni { get; set; }
        public string DNI { get; set; }
        public string MzdData { get; set; }
        [Required]
        public int IdSendingWay { get; set; }
        public string LibroFamilia { get; set; }
        public string CIFSociedad { get; set; }
        public List<string> EscriturasCertificado { get; set; }
        public List<string> PoderesApoderados { get; set; }
        public List<string> DNIsPersonasFisicas { get; set; }
        public string DNIPersonaFisicaNumero { get; set; }
        public bool IsReversoDni { get; set; }
        public bool moveStatus { get; set; } = true;
        public bool AltaJuridica { get; set; }
        public string FileName { get; set; }
    }
}