using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Remediation;
using BestInver.WebPrivada.Shared.Models.Middleware.Remediacion.Enums;
using BESTINVER.GestorAltas.Web.Public.Models.Register;
using BESTINVER.GestorAltas.Web.Public.Models.Remediacion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BESTINVER.GestorAltas.Utilities.Extensions;
using BestInver.WebPrivada.Shared.Models.Microservices.Customers;

namespace BESTINVER.GestorAltas.Web.Public.Profiles
{
    public class RemediacionProfile : Profile
    {
        public RemediacionProfile() : base(nameof(RemediacionProfile))
        {
            CreateMap<RemediacionRequest, RemediacionModel>().ConvertUsing<RemediacionRequestConverter>();
            CreateMap<UserTestAnswer, RemediacionTestModel>()
                .ForMember(x => x.IdAnswer, o => o.MapFrom(s => s.AnswerId))
                .ForMember(x => x.IdQuestion, o => o.MapFrom(s => s.QuestionId))
                .ForMember(x => x.OtherAnswer, o => o.MapFrom(s => s.OtherAnswer))
                .ReverseMap();
            CreateMap<RemediacionTest, RemediacionTestModel>()
                .ForMember(x => x.IdQuestion, o => o.MapFrom(s => s.QuestionId))
                .ForMember(x => x.OtherAnswer, o => o.MapFrom(s => s.OtherAnswer))
                .ForMember(x => x.IdAnswer, o => o.MapFrom(s => s.AnswerId))
                .ReverseMap();
        }
    }

    public class RemediacionRequestConverter : ITypeConverter<RemediacionRequest, RemediacionModel>
    {
        public RemediacionModel Convert(RemediacionRequest source, RemediacionModel destination, ResolutionContext context)
        {
            destination = new RemediacionModel
            {
                PersonalData = new RemediacionPersonalDataModel(),
                Test = new List<RemediacionTestModel>()
            };

            MapToModel(source, destination);
            MapToPersonalData(source, destination.PersonalData);
            destination.IsExpiredKnowledgeTest = source.IsExpiredKnowledgeTest.HasValue && source.IsExpiredKnowledgeTest.Value;
            return destination;
        }

        private static void MapToModel(RemediacionRequest source, RemediacionModel destination)
        {
            var lastStatus = source.RemediacionRequestStatus.OrderByDescending(s => s.Created).FirstOrDefault();

            destination.ClientCode = source.Applicant.ClientCode.Trim();
            destination.ClientId = source.Applicant.RDTitular.Trim();
            destination.RemediacionId = source.Id.ToString("D");
            destination.RemediacionChannel = source.RemediationChannelType.HasValue ? source.RemediationChannelType.Value : 0;
            destination.RequestType = source.RequestType;
            MapUpdateDocument(source, destination);
            MapUpdateTest(source, destination);
            destination.PendingSignature = 
                (lastStatus.IdStatus == (int)RequestStatusEnum.TestConocimientoActualizado || 
                lastStatus.IdStatus == (int)RequestStatusEnum.TestActualizadoRiesgo) 
                && source.SendType == 1;
        }

        private static void MapToPersonalData(RemediacionRequest source, RemediacionPersonalDataModel destination)
        {
            destination.Birthday = source.Applicant.Birthday;
            destination.BornPlace = source.Applicant.BornPlace;
            destination.Dni = source.Applicant.DNI.Trim();
            destination.Email = source.Applicant.Email;
            destination.FirstSurname = source.Applicant.Surname;
            destination.IsForeignDni = source.Applicant.IsForeignDNI;
            destination.Name = source.Applicant.Name;
            destination.PhoneNumber = source.Applicant.MobilePhoneNumber.StripPrefix("+34");
            destination.RDTitular = source.Applicant.RDTitular.Trim();
            destination.RemediacionId = source.Id;
            destination.RequestType = (RequestTypeEnum)source.RequestType;
            destination.Role = source.TestType.HasValue ? source.TestType.Value : 1;
            destination.SecondSurname = string.Empty;
            destination.SendType = source.SendType.HasValue ? source.SendType.Value : 0;
            destination.FiscalCountry = source.Applicant.PaisFiscalRD.HasValue ? source.Applicant.PaisFiscalRD.Value : 0;

            var country = source.Applicant.ApplicantCountries.FirstOrDefault(c => c.IdCountryType == (int)CountryTypeEnum.Nacimiento);
            if(country != null)
            {
                destination.Country = country.IdCountry;
            }

            var nationality = source.Applicant.ApplicantCountries.FirstOrDefault(c => c.IdCountryType == (int)CountryTypeEnum.Nacionalidad);
            if (nationality != null)
            {
                destination.Nacionality = nationality.IdCountry;
            }
        }

        private static void MapUpdateDocument(RemediacionRequest source, RemediacionModel destination)
        {
            bool updateDocument = source.RequestType == (int)RequestTypeEnum.DNI || source.RequestType == (int)RequestTypeEnum.Test_DNI;

            if(source.RemediationChannelType == (int)RemediacionChannelType.Telefonico) { updateDocument = false; }
            
            destination.UpdateDocument = updateDocument;
        }

        private static void MapUpdateTest(RemediacionRequest source, RemediacionModel destination)
        {
            var lastStatus = source.RemediacionRequestStatus.OrderByDescending(s => s.Created).FirstOrDefault();
            bool updateTest = source.RequestType == (int)RequestTypeEnum.Test || source.RequestType == (int)RequestTypeEnum.Test_DNI;

            if (lastStatus.IdStatus >= (int)RequestStatusEnum.TestConocimientoActualizado) { updateTest = false; }

            destination.UpdateTest = updateTest;
        }
    }
}