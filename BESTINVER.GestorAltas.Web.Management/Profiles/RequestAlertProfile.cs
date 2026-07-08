using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Alerts;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.Web.Management.Models;
using BESTINVER.GestorAltas.Web.Models;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class RequestAlertProfile : Profile
    {
        public RequestAlertProfile() : base(nameof(RequestAlertProfile))
        {
            CreateMap<Alert, RequestAlertModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id ?? 0))
                .ForMember(x => x.Comments, o => o.MapFrom(s => s.Comments))
                .ForMember(x => x.Details, o => o.MapFrom(s => s.Details))
                .ForMember(x => x.EndDate, o => o.MapFrom(s => s.EndDate))
                .ForMember(x => x.AlertStatus, o => o.MapFrom(s => s.Status))
                .ForMember(x => x.AlertTypeId, o => o.MapFrom(s => s.AlertType.Id))
                .ForMember(x => x.RequestId, o => o.MapFrom(s => s.RequestId))
                .ForMember(x => x.StartDate, o => o.MapFrom(s => s.BeginDate))
                .ForMember(x => x.Responsbile, o => o.MapFrom(s => s.Responsible))
                .ForMember(x => x.IdAria, o => o.MapFrom(s => s.IdAria))
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
                .ForMember(x => x.EndDate, o => o.MapFrom(s => s.EndDate))
                .ForMember(x => x.Status, o => o.MapFrom(s => s.AlertStatus))
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.RequestId, o => o.MapFrom(s => s.RequestId))
                .ForMember(x => x.BeginDate, o => o.MapFrom(s => s.StartDate))
                .ForMember(x => x.Responsible, o => o.MapFrom(s => s.Responsbile))
                .ForMember(x => x.IdAria, o => o.MapFrom(s => s.IdAria));

            CreateMap<PaginatedResult<Alert>, IEnumerable<RequestAlertModel>>()
              .ConstructUsing((s, context) => context.Mapper.Map<IEnumerable<RequestAlertModel>>(s.Items))
              .ReverseMap();


            CreateMap<Alert, ApproveCotitularModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id ?? 0))
                .ForMember(x => x.Comments, o => o.MapFrom(s => s.Comments))
                .ForMember(x => x.Details, o => o.MapFrom(s => s.Details))
                .ForMember(x => x.EndDate, o => o.MapFrom(s => s.EndDate))
                .ForMember(x => x.AlertStatus, o => o.MapFrom(s => s.Status))
                .ForMember(x => x.AlertTypeId, o => o.MapFrom(s => s.AlertType.Id))
                .ForMember(x => x.RequestId, o => o.MapFrom(s => s.RequestId))
                .ForMember(x => x.StartDate, o => o.MapFrom(s => s.BeginDate))
                .ForMember(x => x.Responsbile, o => o.MapFrom(s => s.Responsible))
                .ForMember(x => x.IdAria, o => o.MapFrom(s => s.IdAria))
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
                .ForMember(x => x.EndDate, o => o.MapFrom(s => s.EndDate))
                .ForMember(x => x.Status, o => o.MapFrom(s => s.AlertStatus))
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.RequestId, o => o.MapFrom(s => s.RequestId))
                .ForMember(x => x.BeginDate, o => o.MapFrom(s => s.StartDate))
                .ForMember(x => x.Responsible, o => o.MapFrom(s => s.Responsbile))
                .ForMember(x => x.IdAria, o => o.MapFrom(s => s.IdAria));
        }
    }
}