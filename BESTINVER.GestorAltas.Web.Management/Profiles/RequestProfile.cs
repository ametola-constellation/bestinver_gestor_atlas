using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;

using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using BESTINVER.GestorAltas.Web.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class RequestProfile : Profile
    {
        public RequestProfile() : base(nameof(RequestProfile))
        {
            CreateMap<Request, RequestValidation>();
            CreateMap<Request, RequestValidationNoRestrictions>();
            CreateMap<Request, RequestModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.IdRequest, o => o.MapFrom(s => s.IdRequest))
                .ForMember(x => x.IdCuenta, o => o.MapFrom(s => s.IdCuenta))
                .ForMember(x => x.IdProducto, o => o.MapFrom(s => s.Product.Id))
                .ForMember(x => x.IdRequestSignature, o => o.MapFrom(s => s.RequestDocumentGroup.DocumentSignatureTypeId))
                .ForMember(x => x.IdRequestAdviceProduct, o => o.MapFrom(s => s.IdRequestAdviceProduct))
                .ForMember(x => x.IdSendingWay, o => o.MapFrom(s => s.IdSendingWay))
                .ForMember(x => x.IdRequestChannel, o => o.MapFrom(s => s.IdRequestChannel))
                .ForMember(x => x.NombreProducto, o => o.MapFrom(s => s.Product.Name))
                .ForMember(x => x.RequestFinishDate, o => o.MapFrom(s => s.RequestFinishDate))
                .ForMember(x => x.RequestStartDate, o => o.MapFrom(s => s.RequestStartDate))
                .ForMember(x => x.FoundClass, o => o.MapFrom(s => s.IdFoundType))
                .ForMember(x => x.HasSuitableTest, o => o.MapFrom(s => s.RequestAdviceProduct != null))
                .ReverseMap();
        }
    }
}