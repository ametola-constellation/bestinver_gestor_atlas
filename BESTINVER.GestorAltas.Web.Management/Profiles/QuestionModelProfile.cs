using AutoMapper;
using BESTINVER.GestorAltas.Web.Management.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class QuestionModelProfile : Profile
    {
        public QuestionModelProfile() : base(nameof(QuestionModelProfile))
        {
            CreateMap<QuestionDetailModel, QuestionPublicModel>()
                   .ForMember(x => x.Departamento, o => o.Ignore())
                   .ForMember(x => x.Cargo, o => o.Ignore())
                   .ForMember(x => x.Entidad, o => o.Ignore());

            CreateMap<QuestionDetailModel, QuestionAdminModel>()
                  .ForMember(x => x.Cargo, o => o.Ignore())
                  .ForMember(x => x.Entidad, o => o.Ignore());

            CreateMap<QuestionDetailModel, QuestionSecondFiscalCountry>()
                .ForMember(x => x.DocumentType, o => o.Ignore())
                .ForMember(x => x.DocumentNumber, o => o.Ignore())
                .ForMember(x => x.DocumentExpirationDate, o => o.Ignore())
                .ForMember(x => x.DocumentIdentification, o => o.Ignore())
                .ForMember(x => x.DocumentTypes, o => o.Ignore())
                .ForMember(x => x.Countries, o => o.Ignore());
        }
    }
}