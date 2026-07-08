using BestInver.WebPrivada.Shared.Models.Microservices.Shared;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class SharedService : ISharedService
    {
        private readonly IApiWebPrivadaHelper api;
#pragma warning disable S1075 // URIs should not be hardcoded
        private const string fileBaseAddress = "/api/files";
        private const string sharedBaseAddress = "/api/shared";
#pragma warning restore S1075 // URIs should not be hardcoded

        public SharedService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public async Task<FileContentResult> DownloadFile(string encryptedUrl, string fileName)
        {
            var file = await api.GetFileAPI($"{fileBaseAddress}/requestDocument/{encryptedUrl}");

            if (file == null)
            {
                return null;
            }

            file.FileDownloadName = fileName[(fileName.IndexOf('_') + 1)..];
            return file;
        }

        public async Task<LegalContactInfo> GetLegalModalContent()
        {
            try
            {
                return await api.GetWebAPI<LegalContactInfo>($"{sharedBaseAddress}/legalcontactinfo").ConfigureAwait(false);
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
