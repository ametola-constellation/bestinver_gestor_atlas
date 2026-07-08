using BestInver.Core.Utils.Helpers;
using BESTINVER.GestorAltas.Web.Models;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Public.Helpers
{
    public static class PublicUrlHelper
    {
        public static List<PdfDocumentsDataFile> GetPublicUrlDownloadDocuments(List<PdfDocumentsDataFile> documents, string baseUrl, string aes256Key)
        {
            if (documents != null)
            {
                var docList = new List<PdfDocumentsDataFile>();
                foreach (var docfile in documents)
                {
                    docList.Add(new PdfDocumentsDataFile(docfile.Label, GetPublicUrlDownloadDocument(docfile.Url, baseUrl, aes256Key), docfile.DoSign));
                }
                return docList;
            }
            return null;
        }

        public static string GetPublicUrlDownloadDocument(string privateUrl, string baseUrl, string aes256Key)
        {
            if (string.IsNullOrWhiteSpace(privateUrl))
            {
                return string.Empty;
            }

            var encryptedUrl = CryptAes256Helper.EncryptUrl(privateUrl, aes256Key);

            var filename = privateUrl[(privateUrl.LastIndexOf("/") + 1)..];
            filename = filename[(filename.IndexOf("_") + 1)..];

            return string.Join("/",
                baseUrl,
                encryptedUrl,
                filename);
        }
    }
}
