using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Address;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface IApplicantService
    {
        Task<SignUpApplicant> GetApplicantByDNI(string dni);

        Task<SignUpApplicant> Insert(SignUpApplicant applicant);

        Task<SignUpApplicant> Update(SignUpApplicant applicant);

        Task<SignUpAddressData> CreateAddress(SignUpAddressData address);

        Task<SignUpAddressData> UpdateAddress(SignUpAddressData address);

        Task<SignUpApplicant> SetApplicantAddress(AddressInfo address, string dni);

        Task SetApplicantCountries(CountryInfo country, string dni);

        Task UpdateApplicantCountry(CountryInfo country, string dni);
    
        Task DeleteApplicantCountry(string dni, string countryType = "");

        Task SetApplicantDocument(IdDocumentInfo document, string dni);

        Task UpdateApplicantDocument(IdDocumentInfo document, string dni);

        Task DeleteApplicantDocument(string dni, string documentType = "");
    }
}