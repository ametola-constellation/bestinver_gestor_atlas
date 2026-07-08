using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Address;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using System;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class ApplicantService : IApplicantService
    {
        private readonly IApiWebPrivadaHelper api;
        private const string baseAddress = "/api/applicant";

        public ApplicantService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public async Task<SignUpApplicant> GetApplicantByDNI(string dni)
        {
            try
            {
                return await api.GetWebAPI<SignUpApplicant>($"{baseAddress}/{dni}").ConfigureAwait(false);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public Task<SignUpApplicant> Insert(SignUpApplicant applicant)
            => api.PostWebAPI($"{baseAddress}/prospect", applicant);

        public Task<SignUpApplicant> Update(SignUpApplicant applicant)
            => api.PutWebAPI($"{baseAddress}/prospect", applicant);

        public Task<SignUpAddressData> CreateAddress(SignUpAddressData address)
            => api.PostWebAPI($"{baseAddress}/address", address);

        public Task<SignUpAddressData> UpdateAddress(SignUpAddressData address)
             => api.PutWebAPI($"{baseAddress}/address", address);

        public Task<SignUpApplicant> SetApplicantAddress(AddressInfo address, string dni)
             => api.PostWebAPI<SignUpApplicant, AddressInfo>($"{baseAddress}/{dni}/address", address);

        public Task SetApplicantCountries(CountryInfo country, string dni)
             => api.PostWebAPI<CountryInfo>($"{baseAddress}/{dni}/countryType", country);

        public Task UpdateApplicantCountry(CountryInfo country, string dni)
              => api.PutWebAPI<CountryInfo>($"{baseAddress}/{dni}/countryType", country);

        public async Task DeleteApplicantCountry(string dni, string countryType = "")
        {
            var url = $"{baseAddress}/{dni}/countries" + (string.IsNullOrEmpty(countryType) ? "" : $"/{countryType}");
            await api.DeleteWebAPI<CountryInfo>(url);
        }

        public Task SetApplicantDocument(IdDocumentInfo document, string dni)
            => api.PostWebAPI<IdDocumentInfo>($"{baseAddress}/{dni}/documentID", document);

        public Task UpdateApplicantDocument(IdDocumentInfo document, string dni)
            => api.PutWebAPI<IdDocumentInfo>($"{baseAddress}/{dni}/documentID", document);

        public async Task DeleteApplicantDocument(string dni, string documentType = "")
        {
            var url = $"{baseAddress}/{dni}/documentID" + (string.IsNullOrEmpty(documentType) ? "" : $"/{documentType}");
            await api.DeleteWebAPI<IdDocumentInfo>(url);
        }
           
    }
}