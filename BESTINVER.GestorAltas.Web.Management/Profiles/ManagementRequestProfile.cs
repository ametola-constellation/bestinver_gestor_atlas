using AutoMapper;
using Bestinver.Auth.Ldap.Identity.Models;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests;
using BestInver.WebPrivada.Shared.Models.Microservices.Users;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.Web.Management.Models;
using BESTINVER.GestorAltas.Web.Models;
using System;
using System.Web;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class ManagementRequestProfile : Profile
    {
        public ManagementRequestProfile() : base(nameof(ManagementRequestProfile))
        {
            CreateMap<UserRole, UserRoleModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id.ToString()))
                .ForMember(x => x.Description, o => o.MapFrom(s => s.Role));

            CreateMap<Address, AddressData>()
                .ForMember(x => x.City, o => o.MapFrom(s => s.Town))
                .ForMember(x => x.Stairs, o => o.MapFrom(s => s.Stair))
                .ForMember(x => x.ViaType, o => o.MapFrom(s => s.StreetType.Id))
                .ForMember(x => x.IdCountry, o => o.MapFrom(s => s.Country.Id))
                .ForMember(x => x.Name, o => o.MapFrom(s => s.Street))
                .ForMember(x => x.PostalCode, o => o.MapFrom(s => s.PostCode))
                .ForMember(x => x.Province, o => o.MapFrom(s => s.Province.Description))
                .ForMember(x => x.AddressExtension, o => o.MapFrom(s => s.Extension))
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id));

            CreateMap<ManagementRequestModel, UnlockModel>()
                .ForMember(x => x.LockedUserName, o => o.MapFrom(_ => HttpContext.Current.User.Identity.Name))
                .ForMember(x => x.IsAdmin, o => o.MapFrom(_ => HttpContext.Current.User.IsInRole(DefaultRoles.Admin)));

            CreateMap<RequestLock, ManagementRequestModel>()
                .IncludeBase<RequestLock, LockedItemModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => IntToGuid(s.Id)));

            CreateMap<ApplicantCountry, CountryModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.Name, o => o.MapFrom(s => s.Description))
                .ForMember(x => x.CountryType, o => o.MapFrom(s => s.CountryType.Id));

            CreateMap<ApplicantDocument, DocumentModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.Number, o => o.MapFrom(s => s.Number))
                .ForMember(x => x.ExpirationDate, o => o.MapFrom(s => s.ExpirationDate));

            CreateMap<Applicant, RequestApplicantModel>();

            CreateMap<Test, TestModel>();

            CreateMap<TestUser, TestUserModel>();

            CreateMap<TestAnswer, TestAnswerModel>();

            CreateMap<TestQuestion, TestQuestionModel>();

            CreateMap<RequestApplicant, RequestApplicantModel>()
                .ForPath(x => x.ApplicantRoleType.Id, o => o.MapFrom(s => s.ApplicantRoleType.Id.ToString()))
                .ForMember(x => x.Countries, o => o.MapFrom(s => s.Applicant.Countries))
                .ForMember(x => x.Documents, o => o.MapFrom(s => s.Applicant.Documents));

            CreateMap<Applicant, ApplicantBasicData>()
                .ForMember(x => x.ApplicantType, o => o.MapFrom(s => s.ApplicantType.Id));

            CreateMap<RequestApplicant, ApplicantBasicData>()
                .ConstructUsing((s, context) => context.Mapper.Map<ApplicantBasicData>(s.Applicant))
                .ForMember(x => x.RequestApplicantType, o => o.MapFrom(s => s.ApplicantRoleType.Id))
                .ForMember(x => x.RequestApplicantTypeName, o => o.MapFrom(s => s.ApplicantRoleType.Description))
                .ForMember(x => x.gdpr, o => o.MapFrom(s => s.Applicant.Gdpr))
                .ForMember(x => x.gdprEvents, o => o.MapFrom(s => s.Applicant.GdprEvents))
                .ForMember(x => x.gdprDate, o => o.MapFrom(s => s.Applicant.GdprDate))
                .ForMember(x => x.gdprEventsDate, o => o.MapFrom(s => s.Applicant.GdprEventsDate));

            CreateMap<Request, ManagementRequestModel>()
                .ConstructUsing((s, context) => context.Mapper.Map<ManagementRequestModel>(s.GetRequestLock()))
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.IsReadonly, o => o.MapFrom(s => s.GetIsReadonly()))
                .ForMember(x => x.ShowOperationChange, o => o.MapFrom(s => s.GetShowOperationChange()))
                .ForMember(x => x.GestorComercialName, o => o.MapFrom(s => s.Username))
                .ForMember(x => x.IndGestorComercial, o => o.MapFrom(s => s.GetIndGestorComercial()))
                .ForMember(x => x.DifferentPostalAddress, o => o.MapFrom(s => s.HasDifferentPostalAddress()))
                .ForPath(x => x.Request, o => o.MapFrom(s => s))
                .ForPath(x => x.PostalAddress, o => o.MapFrom(s => s.GetRequestOwner().Applicant.PostalAddress))
                .ForPath(x => x.FiscalAddress, o => o.MapFrom(s => s.GetRequestOwner().Applicant.FiscalAddress))
                .ForPath(x => x.Data, o => o.MapFrom(x => x.GetRequestOwner()))
                .ForPath(x => x.Data.BasicData, o => o.MapFrom(x => x.GetRequestOwner()))
                .ForPath(x => x.ProductOperations, o => o.MapFrom(s => s.ProductOperations.GetGroupedByProductType()))
                .ForPath(x => x.Cotitulares, o => o.MapFrom(x => x.GetRequestCotitulares()))
                .ForPath(x => x.Data.ContactData, o => o.MapFrom(x => x.GetAddressList()))
                .ForPath(dest => dest.Request.ProductTypeId, opt => opt.MapFrom(src => src.Product.ProductType.Id))
                .GetContactDataAddressTypes()
                .AfterMap((s, d) =>
                {
                    d.Cotitulares.ForEach(c =>
                    {
                        c.RequestStartDate = s.RequestStartDate.Value;
                    });
                });
        }

        private Guid IntToGuid(int value)
        {
            byte[] bytes = new byte[16];
            BitConverter.GetBytes(value).CopyTo(bytes, 0);
            return new Guid(bytes);
        }
    }
}