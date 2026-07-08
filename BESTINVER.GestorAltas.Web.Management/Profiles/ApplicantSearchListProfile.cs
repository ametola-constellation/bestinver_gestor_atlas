using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.Web.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class ApplicantSearchListProfile : Profile
    {
        public ApplicantSearchListProfile() : base(nameof(ApplicantSearchListProfile))
        {
            CreateMap<ApplicantSearchListModel, RequestDashboardSearch>();
            CreateMap<ApplicantSearchListModel, PaginatedSearch<RequestDashboardSearch>>()
                .ForMember(x => x.Sort, o => o.MapFrom((m) =>
                new Sort
                {
                    SortDirection = (BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection?)m.OrderDir,
                    SortField = m.OrderBy
                }))
                .ForMember(x => x.Search, o => o.MapFrom((m, dest, destMember, context) => context.Mapper.Map<RequestDashboardSearch>(m)));
        }
    }
}