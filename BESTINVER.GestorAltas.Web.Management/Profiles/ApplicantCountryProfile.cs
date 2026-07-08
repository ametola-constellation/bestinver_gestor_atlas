using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.Web.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class ApplicantCountryProfile : Profile
    {
        public ApplicantCountryProfile()
        {
            CreateMap<ApplicantCountry, SelectItemModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.Description, o => o.MapFrom(s => s.Description));
        }
    }
}