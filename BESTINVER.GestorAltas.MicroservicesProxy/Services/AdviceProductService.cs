using BestInver.WebPrivada.Shared.Models.Microservices.AdviceProduct;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Request;
using BestInver.WebPrivada.Shared.Models.Shared;
using BestInver.WebPrivada.Shared.Models.Shared.Enums;
using BESTINVER.GestorAltas.MicroservicesProxy.Models;
using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class AdviceProductService : IAdviceProductService
    {
        private readonly IApiWebPrivadaHelper api;
        private readonly IRequestService _requestService;
        private readonly IApplicantService _applicantService;
        private const string adviceProductBaseAddress = "/api/adviceproduct";      

        public AdviceProductService(IApiWebPrivadaHelper apiWebPrivadaHelper, IRequestService requestService, IApplicantService applicantService)
        {
            api = apiWebPrivadaHelper;
            _requestService = requestService;
            _applicantService = applicantService;
        }

        public async Task<PaginatedResult<RequestAdviceProductSearchResponse>> Search(PaginatedSearch<RequestAdviceProductSearch> paginatedSearch)
        {
           var result = await api.PostWebAPI<PaginatedResult<RequestAdviceProductSearchResponse>,
                RequestAdviceProductSearch>($"{adviceProductBaseAddress}/search{paginatedSearch.GetQueryString(new[] { typeof(RequestAdviceProductSearch) })}", paginatedSearch.Search).ConfigureAwait(false);
            return result;
        }

        public async Task<bool> SaveDocuments(AdviceRequestData adviceRequestData)
        {

            var formData = new MultipartFormDataContent
            {
                { new StringContent(adviceRequestData.IdAccount.ToString()), "IdAccount" },                                
                { new StringContent(adviceRequestData.Suitable.ToString()), "Suitable" },
                { new StringContent(adviceRequestData.LoggedUser), "LoggedUser" },                
            };

            if (!string.IsNullOrWhiteSpace( adviceRequestData.DocumentNumber))
            {
                formData.Add(new StringContent(adviceRequestData.DocumentNumber), "DocumentNumber");
            }
            if (!string.IsNullOrWhiteSpace(adviceRequestData.IdRequest))
            {
                formData.Add(new StringContent(adviceRequestData.IdRequest), "IdRequest");
            }            

            if (adviceRequestData.Files != null)
            {
                foreach (var file in adviceRequestData.Files)
                {
                    var fileContent = new StreamContent(file.OpenReadStream());
                    formData.Add(fileContent, "files", file.FileName);
                }
            }

            return await api.PostWebAPIMultipart<bool>($"{adviceProductBaseAddress}/createAdvice", formData);
        }

        public async Task<bool> HasRequestDocuments(string requestId, string documentNumber)
        {
            var result = await _requestService.GetRequestDocuments(Guid.Parse(requestId), documentNumber).ConfigureAwait(false);
            return result.Count() > 0;
        }

        public string GetTextSuitableColumn(AdviceProductDocumentParameters parameters)
        {
            var isPending = (parameters.RequestStatusId == (int)RequestStatusEnum.PendingSignature || parameters.RequestStatusId == (int)RequestStatusEnum.PendingSocialize);

            if (parameters.Suitable is null && isPending)
            {
                return $"<a href='#' onclick=\"openModal('{parameters.RequestID}', '{parameters.IdAccount}', '{parameters.DocumentNumber}', '{parameters.CustomerFullName}')\">Generar</a>";
            }

            if (parameters.Suitable is not null)
            {
                return (bool)parameters.Suitable ? "Idóneo" : "No Idóneo";
            }

            return "-";
        }

        public async Task<bool> HasRequestPending(string documentNumber, string idAccount)
        {
            var searchParams = new PaginatedSearch<RequestAdviceProductSearch>
            {
                Limit = null,
                Sort = new Sort
                {
                    SortDirection = SortDirection.Desc,
                    SortField = "Request.RequestStartDate"
                },
                Search = new RequestAdviceProductSearch
                {
                    DNI = documentNumber,
                    IdAccount = idAccount,
                }
            };

            var result = await Search(searchParams).ConfigureAwait(false);
            var pendingStatuses = new[]
            {
                RequestStatusEnum.PendingSignature,
                RequestStatusEnum.PendingSocialize
            };


            if (result.Items is not null && result.Items.Count() > 0)
            {
                var hasPendingRequest = result.Items.Any(request =>
                    {
                        var latestStatus = request.Status
                               .OrderByDescending(s => s.StartDate)
                               .FirstOrDefault();

                        return latestStatus is not null && pendingStatuses.Contains((RequestStatusEnum)latestStatus.IdStatus);
               });

                return hasPendingRequest;
            }

            return false;
        }

        public async Task<bool> IsPerson(string documentNumber)
        {
            var result = await _applicantService.GetApplicantByDNI(documentNumber).ConfigureAwait(false);
            var isPerson = result.BasicData.ApplicantType == (int)PersonTypeEnum.Fisica;

            return isPerson;
        }
    }
}
