using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BESTINVER.GestorAltas.Web.Models.Requests;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Profiles
{
    public class OperationProfile : Profile
    {
        public OperationProfile() : base(nameof(OperationProfile))
        {
            CreateMap<RequestOperation, OperationModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.IdOperationType, o => o.MapFrom(s => s.OperationType.Id))
                .ForMember(x => x.IdTransferType, o => o.MapFrom(s => s.Transfer.TransferType.Id))
                .ForMember(x => x.FundReceived, o => o.MapFrom(s => s.FundReceived))
                .ForMember(x => x.FundReceivedDate, o => o.MapFrom(s => s.FundReceivedDate))
                .ForMember(x => x.MonthlyAmount, o => o.MapFrom(s => s.MonthlyAmount))
                .ForMember(x => x.OperationDisplayName, o => o.MapFrom(s => s.OperationType.Name))
                .ForMember(x => x.ParOpe, o => o.MapFrom(s => s.ParOpe))
                .ForMember(x => x.PayerName, o => o.MapFrom(s => s.PayerName))
                .ForMember(x => x.Amount, o => o.MapFrom(s => s.Amount))
                .ForMember(x => x.ParticipantAccount, o => o.MapFrom(s => s.Transfer.ParticipantAccount))
                .ForMember(x => x.PlanCode, o => o.MapFrom(s => s.Transfer.PlanCode))
                .ForMember(x => x.PlanName, o => o.MapFrom(s => s.Transfer.PlanName))
                .ForMember(x => x.After2007, o => o.MapFrom(s => s.Transfer.After2007))
                .ForMember(x => x.Before2007, o => o.MapFrom(s => s.Transfer.Before2007))
                .ForMember(x => x.FondoCode, o => o.MapFrom(s => s.Transfer.FondoCode))
                .ForMember(x => x.FondoISIN, o => o.MapFrom(s => s.Transfer.FondoISIN))
                .ForMember(x => x.FondoType, o => o.MapFrom(s => s.Transfer.FondoType))
                .ForMember(x => x.FondoName, o => o.MapFrom(s => s.Transfer.FondoName))
                .ForMember(x => x.ManagerCode, o => o.MapFrom(s => s.Transfer.ManagerCode))
                .ForMember(x => x.ManagerName, o => o.MapFrom(s => s.Transfer.ManagerName))
                .ForMember(x => x.OperationDisplayWayToPay, o => o.MapFrom(s => s.WayToPay.Name))
                .ForMember(x => x.IBAN, o => o.MapFrom(s => s.IBAN))
                .ForMember(x => x.ExternalCode, o => o.MapFrom(s => s.ExternalCode))
                .ForMember(x => x.InitialDay, o => o.MapFrom(s => s.InitialDay));


            CreateMap<SignUpRequestOperation, RequestOperation>()
            .ForMember(x => x.Amount, o => o.MapFrom(s => s.Amount))
            .ForMember(x => x.FundReceived, o => o.MapFrom(s => s.FundReceived))
            .ForMember(x => x.FundReceivedDate, o => o.MapFrom(s => s.FundReceivedDate))
            .ForMember(x => x.IBAN, o => o.MapFrom(s => s.IBAN))
            .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
            .ForMember(x => x.IdOperationType, o => o.MapFrom(s => s.IdOperationType))
            .ForMember(x => x.IdWayToPay, o => o.MapFrom(s => s.IdWayToPay))
            .ForMember(x => x.MonthlyAmount, o => o.MapFrom(s => s.MonthlyAmount))
            .ForMember(x => x.ParOpe, o => o.MapFrom(s => s.ParOpe))
            .ForMember(x => x.PayerName, o => o.MapFrom(s => s.PayerName))
            .ForMember(x => x.EndMonth, o => o.Ignore())
            .ForMember(x => x.EndYear, o => o.Ignore())
            .ForMember(x => x.IdPeriodicity, o => o.Ignore())
            .ForMember(x => x.InitialMonth, o => o.Ignore())
            .ForMember(x => x.InitialYear, o => o.Ignore())
            .ForMember(x => x.InternalTransfer, o => o.Ignore())
            .ForMember(x => x.Refund, o => o.Ignore())
           .AfterMap((s, d) =>
           {
               if (s.IdOperationType == (int)OperationType.Traspaso)
               {
                   d.Transfer = new RequestTransfer
                   {
                       After2007 = s.After2007,
                       Before2007 = s.Before2007,
                       FondoCode = s.FondoCode,
                       FondoISIN = s.FondoISIN,
                       FondoName = s.FondoName,
                       FondoType = s.FondoType,
                       ManagerCode = s.ManagerCode,
                       ManagerName = s.ManagerName,
                       ParticipantAccount = s.ParticipantAccount,
                       PlanCode = s.PlanCode,
                       PlanName = s.PlanName,
                       TransferType = new RequestTransferType
                       {
                           Id = (int)s.IdTransferType
                       }
                   };
               }
               d.OperationType = new RequestOperationType
               {
                   Id = s.IdOperationType
               };
           });
        }
    }
}