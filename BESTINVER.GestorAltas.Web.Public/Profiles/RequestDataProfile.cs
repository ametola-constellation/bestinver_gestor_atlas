using AutoMapper;
using BESTINVER.GestorAltas.Web.Models;
using BESTINVER.GestorAltas.Web.Public.Models.Register;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Public.Profiles
{
    public class RequestDataProfile : Profile
    {
        public RequestDataProfile() : base(nameof(RequestDataProfile))
        {
            CreateMap<RegisterData, BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request.RequestFullData>().ConvertUsing<RequestConverter>();
        }
    }
}