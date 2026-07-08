using BestInver.WebPrivada.Shared.Models.Microservices.Remediation;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Request;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Response;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class SignaturesService : ISignaturesService
    {
        private readonly IApiWebPrivadaHelper api;
        private const string baseAddress = "/api/signatures";

        public SignaturesService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public Task<SignedRequestStatus> GetDocumentSignedStatus(SignedStatus signedStatus, string action = "")
        {
            string url = $"{baseAddress}/sign/status";
            string actionParameter = (!string.IsNullOrEmpty(action) ? $"?action={action}" : "");
            url = string.Concat(url, actionParameter);

            return api.PostWebAPI<SignedRequestStatus, SignedStatus>(url, signedStatus);
        }

        public Task<SignedDocumentData> GetEcerticDocuments(SignRequest request)
            => api.PostWebAPI<SignedDocumentData, SignRequest>($"{baseAddress}/sign", request);

        public Task<bool> SendIdDocumentToEcertic(DocumentData documentData)
            => api.PostWebAPI<bool, DocumentData>($"{baseAddress}/sendIdDocumentation", documentData);

        public Task<ZipDocuments> GetZipDocuments(Guid requestId)
            => api.GetWebAPI<ZipDocuments>($"{baseAddress}/zip/{requestId}");

        public Task<ReplaySignatureResponse> ReplaySignature(Guid requestId, string dni, bool withOutEmail)
            => api.PostWebAPI<ReplaySignatureResponse>($"{baseAddress}/replay/{requestId}/{dni}/{withOutEmail}", null);

        public Task<ZipDocuments> SendDocumentsPostalDelivery(Guid requestId)
             => api.PostWebAPI<ZipDocuments>($"{baseAddress}/postalDelivery/{requestId}", null);

        public Task<SignedDocumentData> GetSignRemediationRequest(SignRemediationRequest sign)
           => api.PostWebAPI<SignedDocumentData, SignRemediationRequest>($"{baseAddress}/signremediationknowledgetest", sign);
    }
}