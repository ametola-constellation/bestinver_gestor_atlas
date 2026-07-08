using BESTINVER.GestorAltas.Web.Models.Requests;
using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class PdfDocumentsApplicantData: PdfDocumentsData
    {
        public string CompleteName { get; set; }
        public string RequestApplicantType { get; set; }
        public int ProductType { get; set; }
        public string Product { get; set; }
        public DateTime Birthday { get; set; }
        public Guid? ParentRequestId { get; set; }
        public bool Signed { get; set; }
        public List<ApplicantData> Minors { get; set; }
        public ProductOperationModel ProductOperationModel { get; set; }
    }
}
