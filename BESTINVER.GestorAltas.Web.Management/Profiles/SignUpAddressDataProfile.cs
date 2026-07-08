using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using BestInver.WebPrivada.Shared.Models.Middleware.MiddleOffice;
using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using BESTINVER.GestorAltas.Web.Management.Models.Details;
using BESTINVER.GestorAltas.Web.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class SignUpAddressDataProfile : Profile
    {
        public SignUpAddressDataProfile() : base(nameof(SignUpAddressDataProfile))
        {
            //hacer el mapeo de AddressDataModel a SignUpAddressData
            CreateMap<AddressDataModel, SignUpAddressData>().
                ForMember(x => x.Id, o => o.MapFrom(s => s.Id)).
                ForMember(x => x.ViaType, o => o.MapFrom(s => s.ViaType)).
                ForMember(x => x.Name, o => o.MapFrom(s => s.Name)).
                ForMember(x => x.Number, o => o.MapFrom(s => s.Number)).
                ForMember(x => x.Stairs, o => o.MapFrom(s => s.Stairs)).
                ForMember(x => x.Floor, o => o.MapFrom(s => s.Floor)).
                ForMember(x => x.Door, o => o.MapFrom(s => s.Door)).
                ForMember(x => x.AddressExtension, o => o.MapFrom(s => s.AddressExtension)).
                ForMember(x => x.PostalCode, o => o.MapFrom(s => s.PostalCode)).
                ForMember(x => x.City, o => o.MapFrom(s => s.City)).
                ForMember(x => x.Province, o => o.MapFrom(s => s.Province)).
                ForMember(x => x.IdCountry, o => o.MapFrom(s => s.IdCountry)).
                ForMember(x => x.CountryType, o => o.MapFrom(s => s.CountryType)).
                ForMember(x => x.AddressType, o => o.MapFrom(s => s.AddressType)).ReverseMap();
        }
    }
}
