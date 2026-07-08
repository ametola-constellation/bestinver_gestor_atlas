using BestInver.WebPrivada.Shared.Models.Microservices.Files;
using BestInver.WebPrivada.Shared.Models.Services.RdFile;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface IFilesService
    {
        Task<RdFileExportResult> IdOpe(RdFileRequest fileRequest);

        Task<RdFileExportResult> IdSol(RdFileRequest fileRequest);

        Task<RdFileExportResult> IdPer(RdFileRequest fileRequest);
    }
}