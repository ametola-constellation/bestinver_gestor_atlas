using AutoMapper;
using BESTINVER.GestorAltas.Web.Management.Models;
using BESTINVER.GestorAltas.Web.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class ManagementCotitularDetailsProfile : Profile
    {
        public ManagementCotitularDetailsProfile()
        {
            CreateMap<ManagementRequestModel, ManagementCotitularDetailsModel>();

            CreateMap<RequestApplicantModel, CotitularDataModel>()
                .ForMember(x => x.ApplicantType, o => o.MapFrom(s => s.Applicant.BasicData.ApplicantType))
                .ForMember(x => x.Birthday, o => o.MapFrom(s => s.Applicant.PersonalData.Birthday))
                .ForMember(x => x.Country, o => o.MapFrom(s => s.Applicant.PersonalData.Country))
                .ForMember(x => x.DNI, o => o.MapFrom(s => s.Applicant.BasicData.DNI))
                .ForMember(x => x.Email, o => o.MapFrom(s => s.Applicant.BasicData.Email))
                .ForMember(x => x.FirstSurname, o => o.MapFrom(s => s.Applicant.BasicData.FirstSurname))
                .ForMember(x => x.Gender, o => o.MapFrom(s => s.Applicant.PersonalData.Gender))
                .ForMember(x => x.IDDocumentExpirationDate, o => o.MapFrom(s => s.Applicant.PersonalData.IDDocumentExpirationDate))
                .ForMember(x => x.IDDocumentIsPermanent, o => o.MapFrom(s => s.Applicant.PersonalData.IDDocumentIsPermanent))
                .ForMember(x => x.IsResident, o => o.MapFrom(s => s.Applicant.PersonalData.IsResident))
                .ForMember(x => x.MobilePhoneNumber, o => o.MapFrom(s => s.Applicant.BasicData.MobilePhoneNumber))
                .ForMember(x => x.Nacionality, o => o.MapFrom(s => s.Applicant.PersonalData.Nacionality))
                .ForMember(x => x.Name, o => o.MapFrom(s => s.Applicant.BasicData.Name))
                .ForMember(x => x.PhoneNumber, o => o.MapFrom(s => s.Applicant.PersonalData.PhoneNumber))
                .ForMember(x => x.RequestApplicantType, o => o.MapFrom(s => s.Applicant.BasicData.RequestApplicantType))
                .ForMember(x => x.SecondSurname, o => o.MapFrom(s => s.Applicant.BasicData.SecondSurname))
                .ForMember(x => x.gdpr, o => o.MapFrom(s => s.Applicant.BasicData.gdpr))
                .ForMember(x => x.gdprEvents, o => o.MapFrom(s => s.Applicant.BasicData.gdprEvents))
                .ForMember(x => x.gdprDate, o => o.MapFrom(s => s.Applicant.BasicData.gdprDate))
                .ForMember(x => x.gdprEventsDate, o => o.MapFrom(s => s.Applicant.BasicData.gdprEventsDate))
                .ForMember(x => x.Countries, o => o.Ignore());


        }
    }
}