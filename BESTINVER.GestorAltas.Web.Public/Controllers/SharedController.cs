using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Public.Controllers
{
    [Route("[controller]/[action]")]
    public class SharedController : Controller
    {
        private readonly ISharedService sharedService;

        public SharedController(ISharedService sharedService)

        {
            this.sharedService = sharedService;
        }

        [HttpGet("{encryptedUrl}/{fileName}")]
        public async Task<IActionResult> OpenFile(string encryptedUrl, string fileName)
        {
            var file = await sharedService.DownloadFile(encryptedUrl, fileName);
            file.FileDownloadName = null;
            return file;
        }

    }
}
