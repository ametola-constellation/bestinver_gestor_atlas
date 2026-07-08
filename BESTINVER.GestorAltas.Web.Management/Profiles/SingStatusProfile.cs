using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Request;
using BESTINVER.GestorAltas.Web.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class SingStatusProfile : Profile
    {
        public SingStatusProfile() : base(nameof(SingStatusProfile))
        {
            CreateMap<SignedStatus, SignatureStatusModel>()
                .ForMember(x => x.RequestId, o => o.MapFrom(s => s.RequestId))
                .ForMember(x => x.SignerDNI, o => o.MapFrom(s => s.SignerDNI))
                .ReverseMap();
        }
    }
}