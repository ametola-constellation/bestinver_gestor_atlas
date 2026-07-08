using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.Web.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class LockedItemProfile : Profile
    {
        public LockedItemProfile() : base(nameof(LockedItemProfile))
        {
            CreateMap<RequestLock, LockedItemModel>()
                .ForMember(x => x.LockedIsLocked, o => o.MapFrom(s => s.Locked))
                .ForMember(x => x.LockedStartDate, o => o.MapFrom(s => s.StartDate))
                .ForMember(x => x.LockedUserEmail, o => o.MapFrom(s => s.Useremail))
                .ForMember(x => x.LockedUserName, o => o.MapFrom(s => s.Username));
        }
    }
}