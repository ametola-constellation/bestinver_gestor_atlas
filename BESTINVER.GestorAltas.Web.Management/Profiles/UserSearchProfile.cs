using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Users;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.Web.Models;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class UserSearchProfile : Profile
    {
        public UserSearchProfile() : base(nameof(UserSearchProfile))
        {
            CreateMap<UserSearch, UserSearchModel>()
                .ForMember(x => x.DocumentId, o => o.MapFrom(s => s.DocumentNumber))
                .ReverseMap();

            CreateMap<JQueryDataTableParamModel, Sort>()
                .ForMember(x => x.SortField, o => o.MapFrom(s => s.SColumns))
                .ForMember(x => x.SortDirection, o => o.MapFrom(s => s.SSortDir_0));

            CreateMap<UserSearchModel, PaginatedSearch<UserSearch>>()
                .ForMember(x => x.Offset, o => o.MapFrom(s => s.Filter.IDisplayStart))
                .ForMember(x => x.Limit, o => o.MapFrom(s => s.Filter.IDisplayLength))
                .ForPath(x => x.Sort, o => o.MapFrom(s => s.Filter))
                .ForPath(x => x.Search, o => o.MapFrom(s => s));

            CreateMap<PaginatedResult<UserSearch>, IEnumerable<UserSearchModel>>()
            .ConstructUsing((s, context) => context.Mapper.Map<IEnumerable<UserSearchModel>>(s.Items))
            .ReverseMap();
        }
    }
}