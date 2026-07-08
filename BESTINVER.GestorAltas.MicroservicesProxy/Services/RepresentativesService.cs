using BestInver.WebPrivada.Shared.Models.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BestInver.WebPrivada.Shared.Models.Microservices.Representatives;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class RepresentativesService : IRepresentativesService
    {
        private const string representativesBaseAddress = "/api/representatives";
        private const string requestBaseAddress = "/api/mailteck";
        private readonly IApiWebPrivadaHelper api;

        public RepresentativesService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public Task<IEnumerable<Representative>> GetActiveRepresentatives(RepresentativeSearch search) => api.PostWebAPI<IEnumerable<Representative>, RepresentativeSearch>($"{representativesBaseAddress}/SearchResentatives", search);

        public Task<PaginatedResult<Request>> SearchPendingRequestForSignature(PaginatedSearch<PendingRequestToSignSearch> filter) => api.PostWebAPI<PaginatedResult<Request>, PaginatedSearch<PendingRequestToSignSearch>>($"{representativesBaseAddress}/SearchPendingRequestToSign", filter);
        public Task<List<string>> GetNecessaryDocumentsForProduct(int id) => api.GetWebAPI<List<string>>($"{representativesBaseAddress}/GetNecessaryDocumentsForProduct/{id}");
        public Task<bool> UploadSuscriptionDealSign(UploadSuscriptionDealRequest request) => api.PostWebAPI<bool, UploadSuscriptionDealRequest>($"{representativesBaseAddress}/UploadSuscriptionDealSign", request);
        public Task<bool> SendToMailTeck(Guid request) => api.GetWebAPI<bool>($"{requestBaseAddress}/createrequestinmailteck/{request}");
    }
}
