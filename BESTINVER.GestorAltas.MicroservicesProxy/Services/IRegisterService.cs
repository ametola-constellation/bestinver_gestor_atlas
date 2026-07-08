using BestInver.WebPrivada.Shared.Models.Microservices.Alerts;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.Shared;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Response;
using BESTINVER.GestorAltas.MicroservicesProxy.Models;
using BESTINVER.GestorAltas.Web.Models;
using BESTINVER.GestorAltas.Web.Models.Applicants;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface IRegisterService
    {
        Task<Request> SaveBasicData(SignUpApplicant applicantData, RequestData requestData);

        Task<bool> SaveRequestFullData(RequestFullData model);

        Task<SignedDocumentData> SaveSignatureData(RequestFullData model, bool generateDoc = true);

        Task<ChangeRequestStatusModelResponse> ChangeRequestStatus(ChangeRequestStatusModel model);

        Task<Alert> CreateAlert(Alert alert);

        Task SolveAlert(Alert alert);

        Task<SignedDocumentData> GenerateJuridicDoc(RequestDocumentGroup documentGroup, Guid requestId);

        Task<SignedDocumentData> GenerateDoc(RequestDocumentGroup documentGroup, Guid requestId);

        Task<bool> SaveDni(DNIData model);

        Task<bool> SaveJuridicDocuments(DNIData model);

        Task<PdfDocumentsApplicantData> RestoreDocumentsSignature(SignatureRestore model);

        Task<PdfDocumentsApplicantData> RestoreDocumentUpdate(SignatureRestore model);

        Task SetApplicantSignDate(Guid requestId, string dni);

        RequestStatus UpdateRequestStatus(Request request);

        Task CompleteProccess(Guid requestId);

        Task<bool> SavePassports(DNIData model);

        Task<ApplicantCheckConvenience>CheckExistingApplicantData(string dni, int productId);

        Task<LegalContactInfo> GetLegalModalContent();

        Task SendToMailteckIfDigital(Guid requestId);
    }
}