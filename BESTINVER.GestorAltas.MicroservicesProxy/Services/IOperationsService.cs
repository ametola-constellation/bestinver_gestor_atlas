using BestInver.WebPrivada.Shared.Models.Microservices.Operations;
using BestInver.WebPrivada.Shared.Models.Shared;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface IOperationsService
    {
        Task<IEnumerable<OperationType>> GetOperationTypes();

        Task<PaginatedResult<OperationSearchAutocomplete>> SearchAutocomplete(PaginatedSearch<FundSearch> paginatedSearch);

        Task<ExternalInvestmentFund> FundDetail(string fundId, string fundType);

        Task<PaginatedResult<OperationSearchMarketerAutocomplete>> SearchByIsin(PaginatedSearch<MarketerSearchByISIN> paginatedSearch);

        Task<CancelRDOperationResult> CancelOperation(CancelRDOperationRequest cancelRDOperation);
        Task<string> GenerateRequestId(string documentNumber);
        Task<MultipartFormDataContent> CreateFCRFund(string customerId, string accountId, MultipartFormDataContent createfcrFundOperation);
    }
}