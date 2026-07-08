using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using BESTINVER.GestorAltas.Web.Public.Extensions;

namespace BESTINVER.GestorAltas.Web.Public.Profiles
{
    //public class RequestOperationProfile : Profile
    //{
    //    public RequestOperationProfile() : base(nameof(RequestOperationProfile))
    //    {
    //        CreateMap<SignUpRequestOperation, RequestOperation>()
    //            .ForMember(x => x.Amount, o => o.MapFrom(s => s.Amount))
    //            .ForMember(x => x.FundReceived, o => o.MapFrom(s => s.FundReceived))
    //            .ForMember(x => x.FundReceivedDate, o => o.MapFrom(s => s.FundReceivedDate))
    //            .ForMember(x => x.IBAN, o => o.MapFrom(s => s.IBAN))
    //            .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
    //            .ForMember(x => x.IdOperationType, o => o.MapFrom(s => s.IdOperationType))
    //            .ForMember(x => x.IdWayToPay, o => o.MapFrom(s => s.IdWayToPay))
    //            .ForMember(x => x.MonthlyAmount, o => o.MapFrom(s => s.MonthlyAmount))
    //            .ForMember(x => x.ParOpe, o => o.MapFrom(s => s.ParOpe))
    //            .ForMember(x => x.PayerName, o => o.MapFrom(s => s.PayerName))
    //            .ForMember(x => x.Transfer, o => o.MapFrom(s => s.GetTransfer()));
    //    }
    //}
}