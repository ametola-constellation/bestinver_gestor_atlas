using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Forms;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests;
using BESTINVER.GestorAltas.Web.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class DataItemProfile : Profile
    {
        public DataItemProfile() : base(nameof(DataItemProfile))
        {
            CreateMap<DataItem, SelectItemModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.Description, o => o.MapFrom(s => s.Name))
                .ReverseMap();

            CreateMap<StreetType, SelectItemModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.Description, o => o.MapFrom(s => s.Name));

            CreateMap<QuestionAnswer, SelectItemModel>()
               .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
               .ForMember(x => x.Description, o => o.MapFrom(s => s.Text));
        }
    }
}