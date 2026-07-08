using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.Web.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class ApplicantPersonalDataProfile : Profile

    {
        public ApplicantPersonalDataProfile() : base(nameof(ApplicantPersonalDataProfile))
        {
            CreateMap<Applicant, ApplicantPersonalData>()
                .ForMember(x => x.Nacionality, o => o.MapFrom(s => s.GetNacionalityCountryId()))
                .ForMember(x => x.Country, o => o.MapFrom(s => s.GetCountryId()))
                .ForMember(x => x.Gender, o => o.MapFrom(s => s.Gender.Id));
        }
    }
}