using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.Web.Management.Models;
using System.Linq;

namespace BESTINVER.GestorAltas.Web.Models
{
    public static class ApplicantDataExtensions
    {
        public static ApplicantType GetApplicantType(this ApplicantData applicant)
        {
            return new ApplicantType
            {
                Id = applicant.BasicData.ApplicantType
            };
        }

        public static Gender GetGender(this ApplicantData applicant)
        {
            return new Gender
            {
                Id = applicant.PersonalData.Gender.Value,
            };
        }

        public static BestInver.WebPrivada.Shared.Models.Shared.Address[] GetAddressList(this RequestApplicant request)
        {
            return request.Applicant.GetAddressList();
        }

        public static BestInver.WebPrivada.Shared.Models.Shared.Address[] GetAddressList(this Request request)
        {
            return request.GetRequestOwner().GetAddressList();
        }

        public static BestInver.WebPrivada.Shared.Models.Shared.Address[] GetAddressList(this Applicant applicant)
        {
            return new[] { applicant.PostalAddress, applicant.FiscalAddress };
        }

        private static AddressData SetContactDataAddressType(AddressData x, int i)
        {
            if (x != null && i == 0)
            {
                x.AddressType = nameof(Applicant.PostalAddress);
            }

            if (x != null && i == 1)
            {
                x.AddressType = nameof(Applicant.FiscalAddress);
            }
            return x;
        }

        public static IMappingExpression<T, ApplicantData> GetContactDataAddressTypes<T>(this IMappingExpression<T, ApplicantData> mappingExpression)

        => mappingExpression
            .AfterMap((_, d) => d.ContactData = d.ContactData.Select(SetContactDataAddressType).ToList());

        public static IMappingExpression<T, ManagementRequestModel> GetContactDataAddressTypes<T>(this IMappingExpression<T, ManagementRequestModel> mappingExpression)

        => mappingExpression
            .AfterMap((_, d) => d.Data.ContactData = d.Data.ContactData.Select(SetContactDataAddressType).ToList());

        public static bool HasDifferentPostalAddress(this Request request)
        {
            bool differentAddress = false;
            var addresses = request.GetAddressList();
            if (addresses.Length > 0)
            {
                differentAddress = addresses[0].Id != addresses[1].Id;
            }
            return differentAddress;
        }
    }
}