using BestInver.WebPrivada.Shared.Models.Microservices.Customers;
using BestInver.WebPrivada.Shared.Models.Microservices.Remediation;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Shared;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Documents;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Response;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.MicroservicesProxy.Models;
using BESTINVER.GestorAltas.Web.Models.Remediacion;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface IRemediationService
    {
        Task<RemediacionRequest> GetRequestByRequestId(string requestId);

        Task<RemediacionRequest> GetRequestByApplicantDni(string dni, bool changeLog);

        Task<RemediacionRequest> AddUpdateRequest(RemediacionRequest remedReq);

        Task<RemediacionRequestStatus> AddStatus(RemediacionRequestStatus remedReqStatus);

        Task<RemediacionRequest> GetRequestByRdcode(string RDcode);

        Task<IEnumerable<RemediationClient>> GetIntervenersByClientId(string clientId);

        Task<IEnumerable<RemediationClient>> GetIntervenersByDocumentNumberOrClientId(string client);

        Task<PaginatedResult<RemediacionRequest>> RequestDashboardSearch(PaginatedSearch<RemediationRequestDashboardSearch> paginatedSearch);

        Task<RemediacionApplicant> UpdateCreateApplicant(RemediacionApplicant applicant);

        Task<RemediacionApplicantCountry> UpdateApplicantCountry(RemediacionApplicantCountry country);

        Task<RemediacionApplicantIDDocument> UpdateApplicantDocument(RemediacionApplicantIDDocument document);

        Task<IEnumerable<RemediacionTest>> UpdateApplicantTest(IEnumerable<RemediacionTest> test);

        Task<RemediacionRequest> GetRemediacionRequestByClientInfo(string clientId, string nif, string rdTitular, bool changeLog);
        
        Task AdditionalDocuments(AltasSftp model);

        Task<bool> GenerateLostShortUrl();

        Task<bool> GenerateShortUrl(Guid requestId);

        Task<bool> DeleteApplicantiddocument(string applicantId);
        Task<bool> DeleteApplicantCountries(string applicantId);
        
        Task<RemediacionRequest> GetRequestByApplicantDniOrRdCode(string code, bool changeLog);

        Task<IEnumerable<UserTestAnswer>> GetRDKnowledgeTest(string clientCode);

        Task<LegalContactInfo> GetLegalModalContent();
        Task<IEnumerable<Applicant>> GetJuridicInterveners(Guid requestId);
        Task<IEnumerable<ApplicantRoleRem>> GetApplicantRoles(Guid requestId);
        Task<ApplicantRoleRem> UpdateApplicantRole(ApplicantRoleRem applicantRole);
        Task<RemediacionApplicant> GetApplicant(string applicantId);

        Task<bool> ResendOperation(Guid requestId);
    }
}