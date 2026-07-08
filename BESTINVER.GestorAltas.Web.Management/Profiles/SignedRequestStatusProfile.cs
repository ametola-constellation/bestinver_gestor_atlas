using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Response;
using BESTINVER.GestorAltas.Web.Models;
using System.Linq;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class SignedRequestStatusProfile : Profile
    {
        public class SignedDocumentModel : SignedRequestStatusDocumentModel
        {
            public SignedDocumentModel()
            {
                base.Firmado = true;
            }
        }

        public SignedRequestStatusProfile() : base(nameof(SignedRequestStatusProfile))
        {
            CreateMap<IdData, DNIDataModel>()
                .ForMember(x => x.AnversoDNI, o => o.MapFrom(s => s.AnversoDni))
                .ForMember(x => x.ReversoDNI, o => o.MapFrom(s => s.ReversoDni));
            CreateMap<DocFile, SignedRequestStatusDocumentModel>();
            CreateMap<SignedRequestStatus, SignedRequestStatusModel>()
                .ForMember(x => x.Signer, o => o.MapFrom(s => s.SignersStatus.Aggregate(new StringBuilder(), (a, b) => a.Append(b)).ToString()))
                .ForMember(x => x.SignedStatus, o => o.MapFrom(s => s.SignersStatus.Aggregate(new StringBuilder(), (a, b) => a.Append(b)).ToString()))
                .ForMember(x => x.Signer, o => o.MapFrom(s => s.Tokens.Aggregate(new StringBuilder(), (a, b) => a.Append(b)).ToString()))
                .ForPath(x => x.DNI, o => o.MapFrom(s => s.IdData))
                .ForPath(x => x.Documents, o => o.MapFrom(s => s.DocSignedFiles));
            CreateMap<SignedRequestStatus, SignedRequestStatusJsonModel>()
                .ForPath(x => x.Data, o => o.MapFrom(s => s));
        }
    }
}