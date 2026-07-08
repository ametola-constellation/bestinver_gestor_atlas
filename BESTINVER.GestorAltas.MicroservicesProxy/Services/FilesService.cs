using BestInver.WebPrivada.Shared.Models.Microservices.Files;
using BestInver.WebPrivada.Shared.Models.Services.RdFile;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class FilesService : IFilesService
    {
        private readonly IApiWebPrivadaHelper api;
#pragma warning disable S1075 // URIs should not be hardcoded
        private const string fileBaseAddress = "/api/files";
#pragma warning restore S1075 // URIs should not be hardcoded

        public FilesService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public Task<RdFileExportResult> IdOpe(RdFileRequest fileRequest)
            => api.PostWebAPI<RdFileExportResult, RdFileRequest>($"{fileBaseAddress}/rd/create/idope", fileRequest);

        public Task<RdFileExportResult> IdSol(RdFileRequest fileRequest)
            => api.PostWebAPI<RdFileExportResult, RdFileRequest>($"{fileBaseAddress}/rd/create/idsol", fileRequest);

        public Task<RdFileExportResult> IdPer(RdFileRequest fileRequest)
            => api.PostWebAPI<RdFileExportResult, RdFileRequest>($"{fileBaseAddress}/rd/create/idopeper", fileRequest);
    }
}