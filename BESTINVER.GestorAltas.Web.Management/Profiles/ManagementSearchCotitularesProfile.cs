using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.Web.Management.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class ManagementSearchCotitularesProfile : Profile
    {
        public ManagementSearchCotitularesProfile() : base(nameof(ManagementSearchCotitularesProfile))
        {
            CreateMap<RequestApplicant, ManagementSearchCotitularesModel>()
                .ForMember(x => x.TipoCotitularidad, o => o.MapFrom(s => s.ApplicantRoleType.Description))
                .ForMember(x => x.RequestApplicantType, o => o.MapFrom(s => s.ApplicantRoleType.Id))
                .ForMember(x => x.Mail, o => o.MapFrom(s => s.Applicant.Email))
                .ForMember(x => x.Name, o => o.MapFrom(s => s.Applicant.GetFullName()))
                .ForMember(x => x.MobilePhoneNumber, o => o.MapFrom(s => s.Applicant.MobilePhoneNumber))
                .ForMember(x => x.RdCode, o => o.MapFrom(s => s.Applicant.RdCode))
                .ForMember(x => x.Porcentaje, o => o.MapFrom(s => s.Percentage))
                .ForMember(x => x.NIF, o => o.MapFrom(s => s.Applicant.DNI));
        }
    }
}