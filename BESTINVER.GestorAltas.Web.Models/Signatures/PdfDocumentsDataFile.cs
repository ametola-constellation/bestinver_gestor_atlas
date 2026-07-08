namespace BESTINVER.GestorAltas.Web.Models
{
    public class PdfDocumentsDataFile
    {        
        public PdfDocumentsDataFile()
        {
        }
        
        public PdfDocumentsDataFile(string label, string url, bool doSign)
        {
            Label = label;
            Url = url;
            DoSign = doSign;
        }

        public string Label { get; set; }
        public string Url { get; set; }
        public bool DoSign { get; set; }
    }
}
