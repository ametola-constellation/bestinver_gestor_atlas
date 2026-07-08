using BestInver.WebPrivada.Shared.Models.Microservices.Remediation;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Request;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Response;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface ISignaturesService
    {
        Task<SignedRequestStatus> GetDocumentSignedStatus(SignedStatus signedStatus, string action = "");

        Task<SignedDocumentData> GetEcerticDocuments(SignRequest request);

        Task<bool> SendIdDocumentToEcertic(DocumentData documentData);

        Task<ZipDocuments> GetZipDocuments(Guid requestId);

        Task<ReplaySignatureResponse> ReplaySignature(Guid requestId, string dni, bool withOutEmail);

        Task<ZipDocuments> SendDocumentsPostalDelivery(Guid requestId);

        Task<SignedDocumentData> GetSignRemediationRequest(SignRemediationRequest sign);
    }
}