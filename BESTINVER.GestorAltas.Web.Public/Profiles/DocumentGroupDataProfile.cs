using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using BESTINVER.GestorAltas.Web.Public.Models.Register;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Public.Profiles
{
    public class DocumentGroupDataProfile : Profile
    {
        public DocumentGroupDataProfile() : base(nameof(DocumentGroupDataProfile))
        {
            CreateMap<DocumentGroupData, RequestDocumentGroup>()
                .ForMember(x => x.DocumentSignatureTypeId, o => o.MapFrom(s => s.IdDocumentSignatureType))
                .ForMember(x => x.SendingWayId, o => o.MapFrom(s => s.IdSendingWay));

            CreateMap<ApplicantMobile, ApplicantBasicData>()
                .ForMember(x => x.Dni, o => o.MapFrom(s => s.ApplicantId))
                .ForMember(x => x.Email, o => o.MapFrom(s => s.Mail))
                .ForMember(x => x.MobilePhoneNumber, o => o.MapFrom(s => s.MobilePhone))
                .ForMember(x => x.RequestApplicantType, o => o.MapFrom(s => s.RequestApplicantType));

            CreateMap<ApplicantMobile, SignUpApplicant>()
                .ForMember(x => x.BasicData, o => o.MapFrom(s => s));

            CreateMap<DocumentGroupData, RequestFullData>()
                .ForMember(x => x.RequestId, o => o.MapFrom(s => s.RequestId))
                .ForMember(x => x.requestDocumentGroup, o => o.MapFrom(s => s))
                .ForMember(x => x.Applicants, o => o.MapFrom(s => s.MobilePhoneByApplicant));
        }
    }
}
