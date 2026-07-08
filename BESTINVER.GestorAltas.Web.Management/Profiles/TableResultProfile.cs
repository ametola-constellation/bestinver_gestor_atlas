using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.Web.Management.Models.Dashboard;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class TableResultProfile : Profile
    {
        public TableResultProfile() : base(nameof(TableResultProfile))
        {
            RegisterTable<TableResultModel>();

            CreateMap<PaginatedResult<RequestDashboard>, IEnumerable<TableResultModel>>()
                .ConstructUsing((s, context) => context.Mapper.Map<IEnumerable<TableResultModel>>(s.Items));
        }

        public TableResultProfile(string profileName) : base(profileName)
        {
        }

        public IMappingExpression<RequestDashboard, TDestination> RegisterTable<TDestination>() where TDestination : TableResultModel
        {
            return CreateMap<RequestDashboard, TDestination>()
                             .ForMember(x => x.FriendlyID, o => o.MapFrom(s => s.IdRequest))
                             .ForMember(x => x.RequestID, o => o.MapFrom(s => s.Id.ToString()))
                             .ForMember(x => x.Name, o => o.MapFrom(s => s.ApplicantName))
                             .ForMember(x => x.NIF, o => o.MapFrom(s => s.ApplicantDNI))
                             .ForMember(x => x.AssistedBy, o => o.MapFrom(s => s.AssistedBy))
                             .ForMember(x => x.Status, o => o.MapFrom(s => s.GetStatus()))
                             .ForMember(x => x.PBCAlerts, o => o.MapFrom(s => s.GetPBCAlerts()))
                             .ForMember(x => x.SignAlerts, o => o.MapFrom(s => s.GetSignAlerts()))
                             .ForMember(x => x.TerroristAlert, o => o.MapFrom(s => s.GetTerroristAlerts()))
                             .ForMember(x => x.OtherAlerts, o => o.MapFrom(s => s.GetOtherAlerts()))
                             .ForMember(x => x.RDCode, o => o.MapFrom(s => s.RDCode))
                             .ForMember(x => x.Product, o => o.MapFrom(s => s.GetSingleProduct()))
                             .ForMember(x => x.Amount, o => o.MapFrom(s => s.GetSingleAmount()))
                             .ForMember(x => x.Comments, o => o.MapFrom(s => s.GetStatusComments()))
                             .ForMember(x => x.OperationType, o => o.MapFrom(s => s.GetOperationType()))
                             .ForMember(x => x.IdRequestStatus, o => o.MapFrom(s => s.GetIdStatus()))
                             .ForMember(x => x.IdOperationType, o => o.MapFrom(s => s.GetOperationTypeId()))
                             .ForMember(x => x.IdProductType, o => o.MapFrom(s => s.GetSingleProductTypeId()));
            // .ForMember(x => x.RequestSignedDate, o => o.MapFrom(s => s.RequestSignedDate));
        }
    }
}