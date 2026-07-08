using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Management.Models.AdviceProduct
{
    public class AdviceProductDocumentsRequestModel
    {
        public string RequestID { get; set; }
        public string DocumentNumber { get; set; }
        public string IdAccount { get; set; }
        public string Username { get; set; }
        public bool IsSuitable { get; set; }
        public IFormFile Contract { get; set; }
        public IFormFile Proposal { get; set; }
        public IFormFile Suitability { get; set; }
        public List<IFormFile> OtherFiles { get; set; }
    }
}
