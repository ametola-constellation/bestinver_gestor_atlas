using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.Web.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class RequestStatusProfile : Profile
    {
        public RequestStatusProfile() : base(nameof(RequestStatusProfile))
        {
            CreateMap<RequestStatus, RequestStatusModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.Comments, o => o.MapFrom(s => s.Comments))
                .ForMember(x => x.IDRequest, o => o.MapFrom(s => s.IdRequest))
                .ForMember(x => x.IDStatus, o => o.MapFrom(s => s.IdStatus))
                .ForMember(x => x.Responsible, o => o.MapFrom(s => s.Responsible))
                .ForMember(x => x.StartDate, o => o.MapFrom(s => s.StartDate))
                .ForMember(x => x.StatusName, o => o.MapFrom(s => s.StatusType.Name))
                .ForMember(x => x.StatusDescription, o => o.MapFrom(s => s.StatusType.Description));
        }
    }
}