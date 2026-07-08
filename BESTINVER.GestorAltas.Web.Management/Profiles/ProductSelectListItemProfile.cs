using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class ProductSelectListItemProfile : Profile
    {
        public ProductSelectListItemProfile() : base(nameof(ProductSelectListItemProfile))
        {
            CreateMap<Product, SelectListItem>()
                .ForMember(x => x.Value, o => o.MapFrom(s => s.MoProductId))
                .ForMember(x => x.Text, o => o.MapFrom(s => s.Name));
        }
    }
}