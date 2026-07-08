using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Rendering;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class RequestOperationTypeSelectItemProfile : Profile
    {
        public RequestOperationTypeSelectItemProfile() : base(nameof(RequestOperationTypeSelectItemProfile))
        {
            CreateMap<RequestOperationType, SelectListItem>()
                .ForMember(x => x.Value, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.Text, o => o.MapFrom(s => s.Name));
        }
    }
}