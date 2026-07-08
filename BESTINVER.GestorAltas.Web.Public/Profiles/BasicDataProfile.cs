using AutoMapper;
using BESTINVER.GestorAltas.Web.Public.Extensions;

namespace BESTINVER.GestorAltas.Web.Public.Profiles
{
    public class BasicDataProfile : Profile
    {
        public BasicDataProfile() : base(nameof(BasicDataProfile))
        {
            CreateMap<BESTINVER.GestorAltas.Web.Models.ApplicantBasicData, BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request.SignUpApplicant>()
                .ForMember(x => x.BasicData, o => o.MapFrom(s => s.GetBasicData()))
                .AfterMap((x, d) =>
                {
                    d.IdApplicantChannel = 1;
                });

            CreateMap<BESTINVER.GestorAltas.Web.Models.ApplicantBasicData, BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request.RequestData>()
                .ForMember(x => x.AgentShippingMail, o => o.MapFrom(s => s.AgentShippingMail))
                .ForMember(x => x.IdInitialProduct, o => o.MapFrom(s => s.IdInitialProduct))
                .ForMember(x => x.IdSalesChannel, o => o.MapFrom(s => s.IdSalesChannel))
                .ForMember(x => x.ManagedByCommercial, o => o.MapFrom(s => s.ManagedByCommercial))
                .ForMember(x => x.Username, o => o.MapFrom(s => s.Username))
                .ForMember(x => x.UtmCampaign, o => o.MapFrom(s => s.utm_campaign))
                .ForMember(x => x.UtmContent, o => o.MapFrom(s => s.utm_content))
                .ForMember(x => x.UtmMedium, o => o.MapFrom(s => s.utm_medium))
                .ForMember(x => x.UtmSource, o => o.MapFrom(s => s.utm_source))
                .ForMember(x => x.UtmTerm, o => o.MapFrom(s => s.utm_term))
                .ForMember(x => x.Web, o => o.MapFrom(s => s.web))
                .ForMember(x => x.IsApp, o => o.MapFrom(s => s.isApp))
                .ForMember(x => x.IdRequestChannel, o => o.MapFrom(s => s.IdRequestChannel));
        }
    }
}