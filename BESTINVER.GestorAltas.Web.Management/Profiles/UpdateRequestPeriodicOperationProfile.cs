using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.Web.Management.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class UpdateRequestPeriodicOperationProfile : Profile
    {
        public UpdateRequestPeriodicOperationProfile() : base(nameof(UpdateRequestPeriodicOperationProfile))
        {
            CreateMap<RequestProductOperation, UpdateRequestPeriodicOperationModel>()
                .ForMember(x => x.Amount, o => o.MapFrom(s => s.Operation.Amount))
                .ForMember(x => x.EndMonth, o => o.MapFrom(s => s.Operation.EndMonth))
                .ForMember(x => x.EndYear, o => o.MapFrom(s => s.Operation.EndYear))
                .ForMember(x => x.FundReceived, o => o.MapFrom(s => s.Operation.FundReceived))
                .ForMember(x => x.FundReceivedDate, o => o.MapFrom(s => s.Operation.FundReceivedDate))
                .ForMember(x => x.IBAN, o => o.MapFrom(s => s.Operation.IBAN))
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Operation.Id))
                .ForMember(x => x.IdOperationType, o => o.MapFrom(s => s.Operation.IdOperationType))
                .ForMember(x => x.IdPeriodicity, o => o.MapFrom(s => s.Operation.IdPeriodicity))
                .ForMember(x => x.IdWayToPay, o => o.MapFrom(s => s.Operation.IdWayToPay))
                .ForMember(x => x.InitialDay, o => o.MapFrom(s => s.Operation.InitialDay))
                .ForMember(x => x.InitialMonth, o => o.MapFrom(s => s.Operation.InitialMonth))
                .ForMember(x => x.InitialYear, o => o.MapFrom(s => s.Operation.InitialYear))
                .ForMember(x => x.InternalTransfer, o => o.MapFrom(s => s.Operation.InternalTransfer))
                .ForMember(x => x.MonthlyAmount, o => o.MapFrom(s => s.Operation.MonthlyAmount))
                .ForMember(x => x.OperationType, o => o.MapFrom(s => s.Operation.OperationType))
                .ForMember(x => x.ParOpe, o => o.MapFrom(s => s.Operation.ParOpe))
                .ForMember(x => x.PayerName, o => o.MapFrom(s => s.Operation.PayerName))
                .ForMember(x => x.Refund, o => o.MapFrom(s => s.Operation.Refund))
                .ForMember(x => x.Transfer, o => o.MapFrom(s => s.Operation.Transfer))
                .ForMember(x => x.WayToPay, o => o.MapFrom(s => s.Operation.WayToPay));

            CreateMap<UpdateRequestPeriodicOperationModel, RequestOperation>()
                .ForMember(x => x.Amount, o => o.MapFrom(s => s.Amount))
                .ForMember(x => x.EndMonth, o => o.MapFrom(s => s.EndMonth))
                .ForMember(x => x.EndYear, o => o.MapFrom(s => s.EndYear))
                .ForMember(x => x.FundReceived, o => o.MapFrom(s => s.FundReceived))
                .ForMember(x => x.FundReceivedDate, o => o.MapFrom(s => s.FundReceivedDate))
                .ForMember(x => x.IBAN, o => o.MapFrom(s => s.IBAN))
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.IdOperationType, o => o.MapFrom(s => s.IdOperationType))
                .ForMember(x => x.IdPeriodicity, o => o.MapFrom(s => s.IdPeriodicity))
                .ForMember(x => x.IdWayToPay, o => o.MapFrom(s => s.IdWayToPay))
                .ForMember(x => x.InitialMonth, o => o.MapFrom(s => s.InitialMonth))
                .ForMember(x => x.InitialYear, o => o.MapFrom(s => s.InitialYear))
                .ForMember(x => x.InternalTransfer, o => o.MapFrom(s => s.InternalTransfer))
                .ForMember(x => x.MonthlyAmount, o => o.MapFrom(s => s.MonthlyAmount))
                .ForMember(x => x.OperationType, o => o.MapFrom(s => s.OperationType))
                .ForMember(x => x.ParOpe, o => o.MapFrom(s => s.ParOpe))
                .ForMember(x => x.PayerName, o => o.MapFrom(s => s.PayerName))
                .ForMember(x => x.Refund, o => o.MapFrom(s => s.Refund))
                .ForMember(x => x.Transfer, o => o.MapFrom(s => s.Transfer))
                .ForMember(x => x.WayToPay, o => o.MapFrom(s => s.WayToPay));
        }
    }
}
