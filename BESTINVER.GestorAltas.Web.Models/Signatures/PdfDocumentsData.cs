using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class PdfDocumentsData
    {
        public string Dni { get; set; }
        public string OtpsToken { get; set; }
        public string OtpsTokensSigner { get; set; }
        public int ElectronicSignatureServiceVersion { get; set; }
        public string AccessToken { get; set; }
        public string OtpsPins { get; set; }
        public string OtpsId { get; set; }
        public List<PdfDocumentsDataFile> DocumentList { get; set; }
    }
}
