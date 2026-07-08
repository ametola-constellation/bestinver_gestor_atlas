using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Customers;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Forms;
using BESTINVER.GestorAltas.Web.Public.Models.Register;
using System.Linq;

namespace BESTINVER.GestorAltas.Web.Public.Profiles
{
    public class MasterDataProfile : Profile
    {
        public MasterDataProfile() : base(nameof(MasterDataProfile))
        {
            CreateMap<DataList, MasterDataModel>()
               .ForMember(x => x.Countries, o => o.MapFrom(s => s.Countries))
               .ForMember(x => x.Genders, o => o.MapFrom(s => s.Genders))
               .ForMember(x => x.DocumentSendingWays, o => o.MapFrom(s => s.SendingWays.Where(r => r.Id != 5)))
               .ForMember(x => x.Nationalities, o => o.MapFrom(s => s.Nationalities))
               .ForMember(x => x.Provinces, o => o.MapFrom(s => s.Provinces))
               .ForMember(x => x.ReceivingWays, o => o.MapFrom(s => s.SendingWays.Where(r => r.Id != 1 && r.Id != 4)))
               .ForMember(x => x.SignatureTypes, o => o.MapFrom(s => s.SignatureType))
               .ForMember(x => x.ViaTypes, o => o.MapFrom(s => s.ViaType))
               .ForMember(x => x.SendingWays, o => o.MapFrom(s => s.SendingWays));

            CreateMap<DataItem, Valor>()
                .ForMember(x => x.id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.valor, o => o.MapFrom(s => s.Name));

            CreateMap<IdDocumentType, Valor>()
                .ForMember(x => x.id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.valor, o => o.MapFrom(s => s.Description));

            CreateMap<BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Forms.StreetType, Valor>()
                .ForMember(x => x.id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.valor, o => o.MapFrom(s => s.Name));
        }
    }
}