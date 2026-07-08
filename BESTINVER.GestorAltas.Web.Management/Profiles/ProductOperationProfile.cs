using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;

using System;
using System.Collections.Generic;
using System.Linq;
using BESTINVER.GestorAltas.Web.Management.Models;
using BESTINVER.GestorAltas.Web.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class ProductOperationProfile : Profile
    {
        public ProductOperationProfile() : base(nameof(ProductOperationProfile))
        {
            CreateMap<RequestProductType, RequestProductTypeModel>();
            CreateMap<RequestProduct, RequestProductModel>()
                .ForMember(x => x.IdProduct, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.ProductName, o => o.MapFrom(s => s.Name))
                .ForMember(x => x.ProductType, o => o.MapFrom(s => s.ProductType));
            CreateMap<RequestProductModel, ProductOperationModel>()
                .ReverseMap();
            CreateMap<RequestProductOperation, ProductOperationModel>();
            CreateMap<IGrouping<int, RequestProductOperation>, RequestProductModel>()
                .ConstructUsing((source, context) => context.Mapper.Map<RequestProductModel>(source.First().Product));

            CreateMap<IGrouping<int, RequestProductOperation>, ProductOperationModel>()
                .IncludeBase<IGrouping<int, RequestProductOperation>, RequestProductModel>()
                .ConstructUsing((source, context) => Create(source, context.Mapper));
        }

        private static ProductOperationModel Create(IGrouping<int, RequestProductOperation> source, IRuntimeMapper mapper)
        {
            var product = mapper.Map<RequestProductModel>(source.First().Product);
            var destination = mapper.Map<ProductOperationModel>(product);
            destination.Operations = mapper.Map<List<OperationModel>>(source.Select(x => x.Operation).ToList());
            return destination;
        }
    }
}