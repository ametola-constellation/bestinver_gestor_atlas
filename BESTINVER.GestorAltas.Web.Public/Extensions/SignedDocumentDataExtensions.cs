using BestInver.WebPrivada.Shared.Models.Services.Signatures.Response;
using BESTINVER.GestorAltas.Web.Models;
using BESTINVER.GestorAltas.Web.Public.Helpers;
using System.Collections.Generic;
using System.Linq;

namespace BESTINVER.GestorAltas.Web.Public.Extensions
{
    public static class SignedDocumentDataExtensions
    {
        public static IEnumerable<PdfDocumentsData> GetEcerticDocumentList(this SignedDocumentData signedDocumentData, string baseUrl, string aes256Key)
        {
            List<PdfDocumentsData> returnValue = new List<PdfDocumentsData>();

            if (signedDocumentData != null && signedDocumentData.DocFiles != null && signedDocumentData.DocFiles.Count > 0)
            {
                for (int i = 0; i < signedDocumentData.SignerData.Count; i++)
                {
                    if (signedDocumentData.DocFiles?.ElementAtOrDefault(i) != null)
                    {
                        var docList = new List<PdfDocumentsDataFile>();
                        foreach (var docfile in signedDocumentData.DocFiles[i])
                            docList.Add(new PdfDocumentsDataFile(docfile.Filename, docfile.Url, docfile.DoSign));

                        docList = PublicUrlHelper.GetPublicUrlDownloadDocuments(docList, baseUrl, aes256Key);

                        returnValue.Add(new PdfDocumentsData()
                        {
                            Dni = signedDocumentData.SignerData[i].Dni,
                            OtpsToken = signedDocumentData.OtpsTokens != null ? signedDocumentData.OtpsTokens[i] : string.Empty,
                            OtpsTokensSigner = signedDocumentData.OtpsTokensSigner != null ? signedDocumentData.OtpsTokensSigner[i] : string.Empty,
                            ElectronicSignatureServiceVersion = signedDocumentData.ElectronicSignatureServiceVersion != null ? signedDocumentData.ElectronicSignatureServiceVersion[i] : 3,
                            OtpsId = signedDocumentData.OtpsIds != null ? signedDocumentData.OtpsIds[i] : string.Empty,
                            OtpsPins = signedDocumentData.OtpsPins != null ? signedDocumentData.OtpsPins[i] : string.Empty,
                            AccessToken = signedDocumentData.AccessToken != null && signedDocumentData.AccessToken.Count > 0 ? signedDocumentData.AccessToken[i] : string.Empty,
                            DocumentList = docList
                        });
                    }
                }
            }

            return returnValue;
        }
    }
}
