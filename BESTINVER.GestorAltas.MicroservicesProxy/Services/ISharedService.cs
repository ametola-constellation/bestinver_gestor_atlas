using BestInver.WebPrivada.Shared.Models.Microservices.Shared;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface ISharedService
    {
        Task<FileContentResult> DownloadFile(string encryptedUrl, string fileName);

        Task<LegalContactInfo> GetLegalModalContent();
    }
}
