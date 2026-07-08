using System.Linq;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;

namespace BestInver.WebPrivada.Shared.Models.Microservices.Requests
{
    public static class RequestApplicantExtensions
    {
        public static int? GetNacionalityCountryId(this Applicant applicant)
        {
            return applicant.Countries.FirstOrDefault(c => c.CountryType.Id == (int)CountryType.Nationality)?.Id;
        }

        public static string GetFullName(this Applicant applicant)
            => $"{applicant.Name} {applicant.FirstSurname} {applicant.SecondSurname}";

        public static int? GetCountryId(this Applicant applicant)
        {
            return applicant.Countries.FirstOrDefault(c => c.CountryType.Id == (int)CountryType.Birth)?.Id;
        }

        public static bool HasDifferentPostalAddress(this Applicant applicant)
        {
            return applicant.PostalAddress.Id == applicant.FiscalAddress.Id;
        }
    }
}