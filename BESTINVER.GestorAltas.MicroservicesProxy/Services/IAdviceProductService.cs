using BestInver.WebPrivada.Shared.Models.Microservices.AdviceProduct;

using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.MicroservicesProxy.Models;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface IAdviceProductService
    {        
        Task<bool> SaveDocuments(AdviceRequestData adviceRequestData);
        Task<PaginatedResult<RequestAdviceProductSearchResponse>> Search(PaginatedSearch<RequestAdviceProductSearch> paginatedSearch);
        Task<bool> HasRequestDocuments(string requestId, string documentNumber);
        Task<bool> HasRequestPending(string documentNumber, string idAccount);
        Task<bool> IsPerson(string documentNumber);
        string GetTextSuitableColumn(AdviceProductDocumentParameters parameters);
    }
}
