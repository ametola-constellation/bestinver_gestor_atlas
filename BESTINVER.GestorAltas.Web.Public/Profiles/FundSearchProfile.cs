using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Operations;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.Web.Models;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Public.Profiles
{
    public class FundSearchProfile : Profile
    {
        public FundSearchProfile() : base(nameof(BasicDataProfile))
        {
            RegisterTable<FundSearchResult>();
            RegisterMarketer<MarketerSearchResult>();

            CreateMap<PaginatedResult<OperationSearchAutocomplete>, IEnumerable<FundSearchResult>>()
                .ConstructUsing((s, context) => context.Mapper.Map<IEnumerable<FundSearchResult>>(s.Items));

            CreateMap<PaginatedResult<OperationSearchMarketerAutocomplete>, IEnumerable<MarketerSearchResult>>()
                .ConstructUsing((s, context) => context.Mapper.Map<IEnumerable<MarketerSearchResult>>(s.Items));
        }

        public IMappingExpression<OperationSearchAutocomplete, TDestination> RegisterTable<TDestination>() where TDestination : FundSearchResult
        {
            return CreateMap<OperationSearchAutocomplete, TDestination>()
                             .ForMember(x => x.nombref, o => o.MapFrom(s => s.Fund))
                             .ForMember(x => x.codigo, o => o.MapFrom(s => s.FundId));
        }

        public IMappingExpression<OperationSearchMarketerAutocomplete, TDestination> RegisterMarketer<TDestination>() where TDestination : MarketerSearchResult
        {
            return CreateMap<OperationSearchMarketerAutocomplete, TDestination>()
                             .ForMember(x => x.nombre, o => o.MapFrom(s => s.Agent))
                             .ForMember(x => x.comercializadora, o => o.MapFrom(s => s.AgentId.ToString()));
        }
    }
}