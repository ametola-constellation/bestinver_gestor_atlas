using System;

namespace BESTINVER.GestorAltas.Web.Management.Models.Remediacion
{
    public class NotRemediatedModel
    {
        public int CuentaId { get; set; }
        public int TitularId { get; set; }
        public string NIF { get; set; }
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public DateTime? FechaCaducidadDoc { get; set; }
        public string TestConocimiento { get; set; }
        public string PteRemediar { get; set; }
        public string UrlRemediacion { get; set; }
        public SendTypeEnum? TipoEnvio { get; set; }
        public RequestStatusEnum? Status { get; set; }

        public bool TestConocimientoBool
        {
            get
            {
                return TestConocimiento == "Si";
            }
        }

        public bool PteRemediarBool
        {
            get
            {
                return PteRemediar == "Si";
            }
        }
    }
}