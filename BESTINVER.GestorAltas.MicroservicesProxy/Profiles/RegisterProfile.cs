using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Response;
using BESTINVER.GestorAltas.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Profiles
{
    public class RegisterProfile : Profile
    {
        public RegisterProfile() : base(nameof(RegisterProfile))
        {
            CreateMap<SignedRequestStatus, List<PdfDocumentsData>>()
            .AfterMap((s, d) =>
            {
                for (int i = 0; i < s.Signers.Count; i++)
                {
                    var docList = new List<PdfDocumentsDataFile>();
                    foreach (var docfile in s.DocFiles[i])
                        docList.Add(new PdfDocumentsDataFile(docfile.Filename, docfile.Url, docfile.DoSign));

                    d.Add(new PdfDocumentsData()
                    {
                        Dni = s.Signers[i].Dni,
                        OtpsToken = s.Tokens != null ? s.Tokens[i] : string.Empty,
                        OtpsTokensSigner = s.TokensSigner != null ? s.TokensSigner[i] : string.Empty,
                        AccessToken = s.AccessToken != null ? s.AccessToken[i] : string.Empty,
                        ElectronicSignatureServiceVersion = s.ElectronicSignatureServiceVersions != null ? s.ElectronicSignatureServiceVersions[i] : 3,
                        DocumentList = docList
                    });
                }
            });
            
            CreateMap<SignedRequestStatus, PdfDocumentsApplicantData>()
                .ForMember(dest => dest.AccessToken, opt => opt.MapFrom(src => src.AccessToken.FirstOrDefault()))
                .ForMember(dest => dest.OtpsTokensSigner, opt => opt.MapFrom(src => src.TokensSigner.FirstOrDefault()))
                .ForMember(dest => dest.ElectronicSignatureServiceVersion, opt => opt.MapFrom(src => src.ElectronicSignatureServiceVersions.FirstOrDefault()))
                .AfterMap((s, d) =>
                {
                    var docList = new List<PdfDocumentsDataFile>();
                    foreach (var docfile in s.DocFiles.FirstOrDefault())
                        docList.Add(new PdfDocumentsDataFile(docfile.Filename, docfile.Url, docfile.DoSign));

                    d.Dni = s.Signers.FirstOrDefault().Dni;
                    d.DocumentList = docList;
                    d.OtpsToken = s.Tokens.FirstOrDefault();               
                });
        }
    }
}