using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Backend.Shared.Forms;
using BestInver.WebPrivada.Shared.Models.Microservices.Alerts;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests;
using BESTINVER.GestorAltas.Web.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class SelectItemModelProfile : Profile
    {
        public SelectItemModelProfile() : base(nameof(SelectItemModelProfile))
        {
            CreateMap<AlertType, SelectItemModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id.ToString()))
                .ForMember(x => x.Description, o => o.MapFrom(s => s.Description));

            CreateMap<DataItem, SelectItemModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id.ToString()));

            CreateMap<QuestionAnswer, SelectItemModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id.ToString()))
                .ForMember(x => x.Description, o => o.MapFrom(s => s.Text));
        }
    }
}
