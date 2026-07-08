using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Remediation;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.Web.Management.Models.Remediacion;
using System;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Profiles
{
    public class RemediationProfile : Profile
    {
        public RemediationProfile() : base(nameof(RemediationProfile))
        {
            CreateMap<RemediationChangeLog, ChangeLogModel>()
                .ForMember(x => x.DateChange, o => o.MapFrom(s => DateTime.SpecifyKind(s.DateChange.Value, DateTimeKind.Utc).ToString("o")));

            CreateMap<RemediacionRequestStatus, RemediacionRequestStatusModel>()
                .ForMember(x => x.Created, o => o.MapFrom(s => DateTime.SpecifyKind(s.Created, DateTimeKind.Utc).ToString("o")))
                .ForMember(x => x.Description, o => o.MapFrom(s => s.Description))
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.Name, o => o.MapFrom(s => s.Name))
                .ForMember(x => x.StatusId, o => o.MapFrom(s => s.IdStatus));

            CreateMap<RemediacionRequest, RemediationStatusModel>()
                .ForMember(x => x.ChangeLog, o => o.MapFrom(s => s.ChangeLog))
                .ForMember(x => x.Created, o => o.MapFrom(s => DateTime.SpecifyKind(s.Created, DateTimeKind.Utc).ToString("o")))
                .ForMember(x => x.DNI, o => o.MapFrom(s => s.Applicant.DNI))
                .ForMember(x => x.DNIExpiration, o => o.MapFrom(s => s.Applicant.IDDocumentExpirationDate))
                .ForMember(x => x.DNINotExpire, o => o.MapFrom(s => s.Applicant.IDDocumentIsPermanent))
                .ForMember(x => x.DocuwareIframeUrl, o => o.MapFrom(s => s.DocuwareIframeUrl))
                .ForMember(x => x.Email, o => o.MapFrom(s => s.Applicant.Email))
                .ForMember(x => x.Name, o => o.MapFrom(s => s.Applicant.Name))
                .ForMember(x => x.RDCliente, o => o.MapFrom(s => s.Applicant.ClientCode))
                .ForMember(x => x.RDTitular, o => o.MapFrom(s => s.Applicant.RDTitular))
                .ForMember(x => x.RemediationUrl, o => o.MapFrom(s => s.UrlToken))
                .ForMember(x => x.RequestId, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.RequestType, o => o.MapFrom(s => s.RequestType))
                .ForMember(x => x.SendType, o => o.MapFrom(s => s.SendType))
                .ForPath(x => x.Status, o => o.MapFrom(s => s.RemediacionRequestStatus))
                .ForMember(x => x.Surname, o => o.MapFrom(s => s.Applicant.Surname))
                .ForMember(x => x.Telefono, o => o.MapFrom(s => s.Applicant.MobilePhoneNumber))
                .ForMember(x => x.TestType, o => o.MapFrom(s => s.TestType))
                .ForMember(x => x.Channel, o => o.MapFrom(s => s.RemediationChannelType))
                .ForMember(x => x.ExpiredTest, o => o.MapFrom(s => s.IsExpiredKnowledgeTest.HasValue ? s.IsExpiredKnowledgeTest.Value : false));

            RegisterFilterDigitalRequestsResponseTable<FilterDigitalRequestsResponseModel>();

            CreateMap<PaginatedResult<RemediacionRequest>, IEnumerable<FilterDigitalRequestsResponseModel>>()
                .ConstructUsing((s, context) => context.Mapper.Map<IEnumerable<FilterDigitalRequestsResponseModel>>(s.Items));

            CreateMap<RemediationClient, NotRemediatedModel>()
                 .ForMember(x => x.CuentaId, o => o.MapFrom(s => s.AccountId))
                 .ForMember(x => x.TitularId, o => o.MapFrom(s => s.ClientId))
                 .ForMember(x => x.NIF, o => o.MapFrom(s => s.DocumentNumber))
                 .ForMember(x => x.Nombre, o => o.MapFrom(s => s.Name))
                 .ForMember(x => x.Apellidos, o => o.MapFrom(s => s.Surnames))
                 .ForMember(x => x.FechaCaducidadDoc, o => o.MapFrom(s => s.DocumentNumberExpirationDate))
                 .ForMember(x => x.TestConocimiento, o => o.MapFrom(s => s.KnowledgeTest.HasValue && s.KnowledgeTest.Value == true ? "Si" : "No"))
                 .ForMember(x => x.PteRemediar, o => o.MapFrom(s => s.PendingRemedy.HasValue && s.PendingRemedy.Value == true ? "Si" : "No"));
        }

        public IMappingExpression<RemediacionRequest, TDestination> RegisterFilterDigitalRequestsResponseTable<TDestination>() where TDestination : FilterDigitalRequestsResponseModel
        {
            return CreateMap<RemediacionRequest, TDestination>()
                        .ForMember(x => x.Created, o => o.MapFrom(s => DateTime.SpecifyKind(s.Created, DateTimeKind.Utc).ToString("o")))
                        .ForMember(x => x.DNI, o => o.MapFrom(s => s.Applicant.DNI))
                        .ForMember(x => x.Email, o => o.MapFrom(s => s.Applicant.Email))
                        .ForMember(x => x.Name, o => o.MapFrom(s => s.Applicant.Surname + ", " + s.Applicant.Name))
                        .ForMember(x => x.RDCliente, o => o.MapFrom(s => s.Applicant.ClientCode))
                        .ForMember(x => x.RequestId, o => o.MapFrom(s => s.Id.ToString()));
        }
    }
}