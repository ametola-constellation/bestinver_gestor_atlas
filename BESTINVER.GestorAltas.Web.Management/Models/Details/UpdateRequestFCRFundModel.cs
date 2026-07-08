using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Management.Models.Details
{
    public class UpdateRequestFCRFundModel
    {
        public decimal? Amount { get; set; }
        public int AccountId { get; set; }
        public Guid RequestId { get; set; }
        public List<RequestApplicant> Applicants { get; set; }
        public List<IFormFile> Files { get; set; }
        public int FoundTypeId { get; set; }
    }
}
