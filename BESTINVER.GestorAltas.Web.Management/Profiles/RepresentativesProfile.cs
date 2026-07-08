using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Representatives;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class RepresentativesProfile : Profile
    {
        public RepresentativesProfile() : base(nameof(RepresentativesProfile))
        {
            CreateMap<Representative, SelectListItem>()
                .ForMember(x => x.Value, o => o.MapFrom(s => s.DocumentNumber))
                .ForMember(x => x.Text, o => o.MapFrom(s => $"{s.Name} {s.FirstSurname} {s.SecondSurname}"));
        }
    }
}