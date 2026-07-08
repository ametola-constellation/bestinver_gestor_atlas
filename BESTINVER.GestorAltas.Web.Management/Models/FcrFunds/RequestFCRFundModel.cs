using BestInver.WebPrivada.Shared.Models.Microservices.Portfolios;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Management.Models.FcrFunds
{
    public class RequestFCRFundModel
    {
        public decimal? Amount { get; set; }
        public int AccountId { get; set; }
        public List<RequestApplicant> Applicants { get; set; }
        public List<IFormFile> Files { get; set; }
        public int ProductId { get; set; }
        public string DocumentNumber { get; set; }
        public string Username { get; set; }
        public bool AreConditionsAccepted { get; set; }
        public int CustomerId { get; set; }
        public bool IsConvenient { get; set; }
        public bool IsEmployee { get; set; }
        public bool Advice { get; set; }
        public IEnumerable<AccountProduct> AccountProducts { get; set; }
        public DateTime? LastAdvice { get; set; }
        public bool ValidAdvice { get; set; }
        public Guid? AdviceRequestId { get; set; }
        public IEnumerable<AccountCustomer> AccountCustomers { get; set; }
    }
}
