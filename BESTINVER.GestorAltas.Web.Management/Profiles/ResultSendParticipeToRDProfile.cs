using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp;
using BESTINVER.GestorAltas.MicroservicesProxy.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class ResultSendParticipeToRDProfile : Profile
    {
        public ResultSendParticipeToRDProfile()
        {
            CreateMap<ResultSendParticipeToRD, ResultSendParticipeToRDModel>()
                .ForMember(x => x.CuentaId, o => o.MapFrom(s => s.cuentaId))
                .ForMember(x => x.Message, o => o.MapFrom(s => s.message))
                .ForMember(x => x.OperationsParOpe, o => o.MapFrom(s => s.operationsParOpe))
                .ForMember(x => x.Result, o => o.MapFrom(s => s.result))
                .ReverseMap();
        }
    }
}