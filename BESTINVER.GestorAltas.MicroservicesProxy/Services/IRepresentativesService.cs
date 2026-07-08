using BestInver.WebPrivada.Shared.Models.Microservices.Representatives;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface IRepresentativesService
    {
        Task<IEnumerable<Representative>> GetActiveRepresentatives(RepresentativeSearch search);
        Task<List<string>> GetNecessaryDocumentsForProduct(int id);
        Task<PaginatedResult<Request>> SearchPendingRequestForSignature(PaginatedSearch<PendingRequestToSignSearch> filter);
        Task<bool> UploadSuscriptionDealSign(UploadSuscriptionDealRequest request);
        Task<bool> SendToMailTeck(Guid request);
    }
}
