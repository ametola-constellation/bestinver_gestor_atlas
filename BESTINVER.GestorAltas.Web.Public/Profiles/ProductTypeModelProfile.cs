using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Products;
using BESTINVER.GestorAltas.Web.Public.Models.Register;

namespace BESTINVER.GestorAltas.Web.Public.Profiles
{
    public class ProductTypeModelProfile : Profile
    {
        public ProductTypeModelProfile() : base(nameof(ProductTypeModelProfile))
        {
            CreateMap<ProductType, ProductTypeModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.Description, o => o.MapFrom(s => s.Description))
                .ForMember(x => x.Name, o => o.MapFrom(s => s.Name))
                .ForMember(x => x.OrderToShow, o => o.MapFrom(s => s.OrderToShow));
        }
    }
}