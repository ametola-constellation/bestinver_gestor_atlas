using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.Web.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class ApplicantBasicDataProfile : Profile
    {
        public ApplicantBasicDataProfile() : base(nameof(ApplicantBasicDataProfile))
        {
            CreateMap<Applicant, ApplicantBasicData>();

            CreateMap<ApplicantData, Applicant>()
                .ForMember(x => x.ApplicantType, o => o.MapFrom(s => s.GetApplicantType()))
                .ForMember(x => x.Birthday, o => o.MapFrom(s => s.PersonalData.Birthday))
                .ForMember(x => x.BornPlace, o => o.MapFrom(s => s.PersonalData.BornPlace))
                .ForMember(x => x.DNI, o => o.MapFrom(s => s.BasicData.DNI))
                .ForMember(x => x.Email, o => o.MapFrom(s => s.BasicData.Email))
                .ForMember(x => x.FirstSurname, o => o.MapFrom(s => s.BasicData.FirstSurname))
                .ForMember(x => x.Gender, o => o.MapFrom(s => s.GetGender()))
                .ForMember(x => x.IDDocumentExpirationDate, o => o.MapFrom(s => s.PersonalData.IDDocumentExpirationDate))
                .ForMember(x => x.IDDocumentIsPermanent, o => o.MapFrom(s => s.PersonalData.IDDocumentIsPermanent))
                .ForMember(x => x.IDDocumentType, o => o.MapFrom(s => s.BasicData.IDDocumentType))
                .ForMember(x => x.InformationRight, o => o.MapFrom(s => s.BasicData.InformationRight))
                .ForMember(x => x.IsResident, o => o.MapFrom(s => s.PersonalData.IsResident))
                .ForMember(x => x.Legal, o => o.MapFrom(s => s.BasicData.Legal))
                .ForMember(x => x.MobilePhoneNumber, o => o.MapFrom(s => s.BasicData.MobilePhoneNumber))
                .ForMember(x => x.Name, o => o.MapFrom(s => s.BasicData.Name))
                .ForMember(x => x.PhoneNumber, o => o.MapFrom(s => s.PersonalData.PhoneNumber))
                .ForMember(x => x.SecondSurname, o => o.MapFrom(s => s.BasicData.SecondSurname))
                .ForMember(x => x.RdCode, o => o.MapFrom(s => s.BasicData.RdCode));
        }
    }
}