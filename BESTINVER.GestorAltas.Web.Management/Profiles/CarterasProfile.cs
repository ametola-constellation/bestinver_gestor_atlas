using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Carteras;
using BESTINVER.GestorAltas.Web.Management.Controllers;
using BESTINVER.GestorAltas.Web.Management.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class CarterasProfile : Profile
    {
        public CarterasProfile() : base(nameof(CarterasProfile))
        {
            CreateMap<CarterasModel, Cartera>()
                .ForMember(x => x.ID, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.CarteraName, o => o.MapFrom(s => s.Cartera))
                .ForMember(x => x.Diversificacion, o => o.MapFrom(s => s.Diversificacion.Replace(",", ".")))
                .ForMember(x => x.Efectivo, o => o.MapFrom(s => s.Efectivo.Replace(",", ".")))
                .ReverseMap();

            CreateMap<CarteraUpdateModel, Cartera>()
                .ForMember(x => x.CarteraName, o => o.MapFrom(s => s.Cartera))
                .ReverseMap()
                .ForMember(x => x.Cartera, o => o.MapFrom(s => s.CarteraName));
        }
    }
}