using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Public.Models.Remediacion
{
    public class RemediacionDniModel
    {
        public string RequestId { get; set; }
        public string AnversoDni { get; set; }
        public string ReversoDni { get; set; }
        public string Dni { get; set; }
        public string MzdData { get; set; }
        public string IdSendingWay { get; set; }
        public int ExpirationYear { get; set; }
        public int ExpirationMonth { get; set; }
        public int ExpirationDay { get; set; }
        public bool IsPermanent { get; set; }
    }
}
