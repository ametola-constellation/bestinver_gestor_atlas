using BestInver.WebPrivada.Shared.Models.Microservices.Remediation;
using BestInver.WebPrivada.Shared.Models.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Documents;
using System;
using BestInver.WebPrivada.Shared.Models.Microservices.Customers;
using BESTINVER.GestorAltas.MicroservicesProxy.Models;
using BestInver.WebPrivada.Shared.Models.Microservices.Shared;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.Web.Models.Remediacion;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class RemediationService : IRemediationService
    {
        private readonly IApiWebPrivadaHelper api;
        private readonly ISharedService sharedService;
        private const string remediacionBaseAddress = "/api/remediations";
        private const string customerBaseAddress = "/api/customers";

        public RemediationService(IApiWebPrivadaHelper apiWebPrivadaHelper, ISharedService sharedService)
        {
            api = apiWebPrivadaHelper;
            this.sharedService = sharedService;
        }

        public Task<RemediacionRequest> GetRequestByRequestId(string requestId)
            => api.GetWebAPI<RemediacionRequest>($"{remediacionBaseAddress}/ByRequestId/{requestId}?getChangeLog=false");

        public async Task<RemediacionRequest> GetRequestByApplicantDni(string dni, bool changeLog)
        {
            try
            {
                return await api.GetWebAPI<RemediacionRequest>($"{remediacionBaseAddress}/{dni}?getChangeLog={changeLog}").ConfigureAwait(false);
            }
            catch
            {
                return null;
            }
        }

        public Task<RemediacionRequest> AddUpdateRequest(RemediacionRequest remedReq)
            => api.PostWebAPI($"{remediacionBaseAddress}?getChangeLog=false", remedReq);

        public  Task<RemediacionRequestStatus> AddStatus(RemediacionRequestStatus remedReqStatus)
            => api.PostWebAPI($"{remediacionBaseAddress}/request/status", remedReqStatus);

        public Task<IEnumerable<RemediationClient>> GetIntervenersByClientId(string clientId)
            => api.GetWebAPI<IEnumerable<RemediationClient>>($"{remediacionBaseAddress}/interveners/{clientId}");

        public Task<IEnumerable<RemediationClient>> GetIntervenersByDocumentNumberOrClientId(string client)
            => api.GetWebAPI<IEnumerable<RemediationClient>>($"{remediacionBaseAddress}/interveners/ByDocumentNumberOrClientId/{client}");

        public Task<PaginatedResult<RemediacionRequest>> RequestDashboardSearch(PaginatedSearch<RemediationRequestDashboardSearch> paginatedSearch)
            => api.PostWebAPI<PaginatedResult<RemediacionRequest>, RemediationRequestDashboardSearch>($"{remediacionBaseAddress}/mo/dashboard{paginatedSearch.GetQueryString(typeof(RemediationRequestDashboardSearch))}", paginatedSearch.Search);

        public Task<RemediacionApplicant> UpdateCreateApplicant(RemediacionApplicant applicant)
            => api.PutWebAPI($"{remediacionBaseAddress}/mo/applicant", applicant);

        public Task<RemediacionApplicantCountry> UpdateApplicantCountry(RemediacionApplicantCountry country)
            => api.PutWebAPI($"{remediacionBaseAddress}/mo/applicantcountry", country);

        public Task<RemediacionApplicantIDDocument> UpdateApplicantDocument(RemediacionApplicantIDDocument document)
            => api.PutWebAPI($"{remediacionBaseAddress}/mo/applicantiddocument", document);

        public Task<IEnumerable<RemediacionTest>> UpdateApplicantTest(IEnumerable<RemediacionTest> test)
           => api.PutWebAPI($"{remediacionBaseAddress}/mo/remediationtests", test);
        
        public async Task<RemediacionRequest> GetRemediacionRequestByClientInfo(string clientId, string nif, string rdTitular, bool changeLog)
        {
            string[] cols = ["Id", "Applicants.DNI", "Applicants.ClientCode", "Applicants.Email", "Created", "Applicants.Surname, Applicants.Name"];

            var filter = new PaginatedSearch<RemediationRequestDashboardSearch>
            {
                Search = new RemediationRequestDashboardSearch
                {
                    ClientCode = clientId,
                    RDTitular = rdTitular,
                    DNI = nif
                },
                Limit = 1,
                Offset = 0,
                Sort = new Sort
                {
                    SortField = cols[0],
                    SortDirection = BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection.Asc
                }
            };
            var displayedItems = await RequestDashboardSearch(filter).ConfigureAwait(false);
            var result = displayedItems.Items.FirstOrDefault();
            if (result != null )
            {
                result = await GetRequestByApplicantDni(result.Applicant.DNI, changeLog).ConfigureAwait(false);
            }
            return result;
        }

        public async Task<RemediacionRequest> GetRequestByRdcode(string RDcode)
        {
            try
            {
                return await api.GetWebAPI<RemediacionRequest>($"{remediacionBaseAddress}/rdCode/{RDcode}?getChangeLog=false").ConfigureAwait(false);
            } catch
            {
                return null;
            }
        }

        public Task AdditionalDocuments(AltasSftp model)
            => api.PostWebAPI<AltasSftp>($"{remediacionBaseAddress}/request/{model.RequestId}/additionaldocuments", model);

        public async Task<bool> GenerateLostShortUrl()
        {
            try
            {
                await api.PutWebAPI($"{remediacionBaseAddress}/request/generateLostShortUrl", "");
                return await Task.FromResult(true);
            }
            catch
            {
                return await Task.FromResult(false);
            }
        }

        public async Task<bool> GenerateShortUrl(Guid requestId)
        {
            try
            {
                await api.GetWebAPI<string>($"{remediacionBaseAddress}/request/{requestId}/shortUrl");
                return await Task.FromResult(true);
            }
            catch
            {
                return await Task.FromResult(false);
            }
        }

        public async Task<bool> DeleteApplicantiddocument(string applicantId)
        {
            try
            {
                await api.DeleteWebAPI<string>($"{remediacionBaseAddress}/mo/{applicantId}/applicantiddocument");
                return await Task.FromResult(true);
            }
            catch
            {
                return await Task.FromResult(false);
            }
        }

        public async Task<bool> DeleteApplicantCountries(string applicantId)
        {
            try
            {
                await api.DeleteWebAPI<string>($"{remediacionBaseAddress}/mo/{applicantId}/applicantidcountries");
                return await Task.FromResult(true);
            }
            catch
            {
                return await Task.FromResult(false);
            }
        }

        public async Task<RemediacionRequest> GetRequestByApplicantDniOrRdCode(string code, bool changeLog)
        {
            var result = await  GetRequestByApplicantDni(code, changeLog).ConfigureAwait(false);
            result ??= await GetRemediacionRequestByClientInfo(code, null, null, changeLog).ConfigureAwait(false);
            return result;
        }

        public Task<IEnumerable<UserTestAnswer>> GetRDKnowledgeTest(string clientCode)
            => api.GetWebAPI<IEnumerable<UserTestAnswer>>($"{customerBaseAddress}/{clientCode}/knowledgeTest");

        public async Task<LegalContactInfo> GetLegalModalContent()
        {
            try
            {
                return await sharedService.GetLegalModalContent().ConfigureAwait(false);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public Task<IEnumerable<Applicant>> GetJuridicInterveners(Guid requestId)
            => api.GetWebAPI<IEnumerable<Applicant>>($"{remediacionBaseAddress}/juridicinterveners/{requestId}");

        public Task<IEnumerable<ApplicantRoleRem>> GetApplicantRoles(Guid requestId)
            => api.GetWebAPI<IEnumerable<ApplicantRoleRem>>($"{remediacionBaseAddress}/applicantroles/{requestId}");

        public Task<ApplicantRoleRem> UpdateApplicantRole(ApplicantRoleRem applicantRole)
           => api.PutWebAPI($"{remediacionBaseAddress}/mo/applicantrole", applicantRole);

        public Task<RemediacionApplicant> GetApplicant(string applicantId)
            => api.GetWebAPI<RemediacionApplicant>($"{remediacionBaseAddress}/applicant/{applicantId}");

        public Task<bool> ResendOperation(Guid requestId)
            => api.GetWebAPI<bool>($"{remediacionBaseAddress}/resendoperation/{requestId}");
    }
}