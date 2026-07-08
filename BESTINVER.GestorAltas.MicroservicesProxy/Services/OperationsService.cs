using BestInver.WebPrivada.Shared.Models.Microservices.Operations;
using BestInver.WebPrivada.Shared.Models.Shared;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class CustomerOperationTransactionSearch : PaginatedSearch<OperationTransactionSearch>
    {
        public int CustomerId { get; set; }
    }
    
    public class OperationForCreated
    {
        public decimal Amount { get; set; }
        public int ProductId { get; set; }
        public string CustomerDocumentNumber { get; set; }
        public string Username { get; set; }        
        public bool IsConvenient{ get; set; }
        public bool IsEmployee { get; set; }
        public Guid? AdviceRequestId { get; set; }
        public bool IsAdvice { get; set; }
    }

    public class OperationsService : IOperationsService
    {
        private readonly IApiWebPrivadaHelper api;
        private const string baseAddress = "/api/operations";

        public OperationsService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public Task<IEnumerable<OperationType>> GetOperationTypes()
            => api.GetWebAPI<IEnumerable<OperationType>>($"{baseAddress}/types");


        public async Task<PaginatedResult<OperationSearchAutocomplete>> SearchAutocomplete(PaginatedSearch<FundSearch> paginatedSearch)
        {
            var result = await api.PostWebAPI<PaginatedResult<OperationSearchAutocomplete>,
                FundSearch>($"{baseAddress}{"/funds/searchautocomplete"}{paginatedSearch.GetQueryString(typeof(FundSearch))}", paginatedSearch.Search).ConfigureAwait(false);
            return result;
        }

        public async Task<ExternalInvestmentFund> FundDetail(string fundId, string fundType)
        {
            var result = await api.GetWebAPI<ExternalInvestmentFund>($"{baseAddress}/{"funds/fundDetail"}/{fundId}/{fundType}");
            return result;
        }

        public async Task<PaginatedResult<OperationSearchMarketerAutocomplete>> SearchByIsin(PaginatedSearch<MarketerSearchByISIN> paginatedSearch)
        {
            var result = await api.PostWebAPI<PaginatedResult<OperationSearchMarketerAutocomplete>,
                MarketerSearchByISIN>($"{baseAddress}{"/funds/searchMarketerAutocomplete/ByISIN"}{paginatedSearch.GetQueryString(typeof(MarketerSearchByISIN))}", paginatedSearch.Search).ConfigureAwait(false);
            return result;
        }

        public Task<CancelRDOperationResult> CancelOperation(CancelRDOperationRequest cancelRDOperation)
            => api.PostWebAPI<CancelRDOperationResult,CancelRDOperationRequest>($"{baseAddress}/cancelRDOperation", cancelRDOperation);

        public Task<string> GenerateRequestId(string documentNumber)
            => api.GetWebAPI<string>($"{baseAddress}/requestId/{documentNumber}");

        public Task<MultipartFormDataContent> CreateFCRFund(string customerId, string accountId, MultipartFormDataContent createfcrFundOperation)
            => api.PostWebAPIMultipart<MultipartFormDataContent>($"{baseAddress}/mo/suscriptions/customers/{customerId}/accounts/{accountId}", createfcrFundOperation);        
    }
}