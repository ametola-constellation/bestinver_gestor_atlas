using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.Web.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class ApplicantDataProfile : Profile
    {
        public ApplicantDataProfile() : base(nameof(ApplicantDataProfile))
        {
            CreateMap<RequestApplicant, ApplicantData>()
                .ForPath(x => x.BasicData, o => o.MapFrom(s => s.Applicant))
                .ForPath(x => x.PersonalData, o => o.MapFrom(s => s.Applicant))
                .ForPath(x => x.ContactData, o => o.MapFrom(s => s.GetAddressList()))
                .GetContactDataAddressTypes();

            CreateMap<Applicant, ApplicantData>()
                .ForPath(x => x.Answers, o => o.Ignore())
                .ForPath(x => x.BasicData, o => o.MapFrom(s => s))
                .ForPath(x => x.PersonalData, o => o.MapFrom(s => s))
                .ForPath(x => x.ContactData, o => o.MapFrom(s => new[] { s.PostalAddress, s.FiscalAddress }))

                .GetContactDataAddressTypes();
        }
    }
}