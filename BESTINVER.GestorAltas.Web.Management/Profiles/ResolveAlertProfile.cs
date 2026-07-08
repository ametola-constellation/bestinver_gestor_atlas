using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Alerts;
using BESTINVER.GestorAltas.Web.Management.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class ResolveAlertProfile : Profile
    {
        public ResolveAlertProfile() : base(nameof(ResolveAlertProfile))
        {
            CreateMap<AlertType, AlertType>()
                .ReverseMap();
            CreateMap<Alert, ResolveAlertModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id ?? 0))
                .ForMember(x => x.Comments, o => o.MapFrom(s => s.Comments))
                .ForMember(x => x.Details, o => o.MapFrom(s => s.Details))
                .ForMember(x => x.EndDate, o => o.MapFrom(s => s.EndDate.Value.ToUniversalTime()))
                .ForMember(x => x.AlertStatus, o => o.MapFrom(s => s.Status))
                .ForMember(x => x.AlertTypeId, o => o.MapFrom(s => s.AlertType.Id))
                .ForMember(x => x.RequestId, o => o.MapFrom(s => s.RequestId))
                .ForMember(x => x.StartDate, o => o.MapFrom(s => s.BeginDate.Value.ToUniversalTime()))
                .ForMember(x => x.Responsbile, o => o.MapFrom(s => s.Responsible))
                .AfterMap((s, d) =>
                {
                    d.AlertType = s.AlertType?.Description;
                    d.AlertTypeId = s.AlertType?.Id;
                })
                .ReverseMap()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
                .ForPath(x => x.AlertType, o => o.MapFrom(m => new AlertType
                {
                    Id = m.AlertTypeId ?? 0,
                    Description = m.AlertType
                }))
                .ForMember(x => x.Comments, o => o.MapFrom(s => s.Comments))
                .ForMember(x => x.Details, o => o.MapFrom(s => s.Details))
                .ForMember(x => x.EndDate, o => o.MapFrom(s => s.EndDate.Value.ToUniversalTime()))
                .ForMember(x => x.Status, o => o.MapFrom(s => s.AlertStatus))
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.RequestId, o => o.MapFrom(s => s.RequestId))
                .ForMember(x => x.BeginDate, o => o.MapFrom(s => s.StartDate.Value.ToUniversalTime()))
                .ForMember(x => x.Responsible, o => o.MapFrom(s => s.Responsbile));
        }
    }
}