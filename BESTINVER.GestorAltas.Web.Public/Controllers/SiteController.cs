using System;
using System.IO;
using Microsoft.AspNetCore.Mvc;

namespace BESTINVER.GestorAltas.Web.Public.Controllers
{
    public class SiteController : Controller
    {
        public IActionResult Download(string id, [FromQuery] bool isBase64 = false)
        {
            var filename = Path.Combine("wwwroot", id);
            string path = Path.Combine(Directory.GetCurrentDirectory(), filename);
            var document = new FileInfo(path);

            if (!document.Exists)
            {
                return NotFound();
            }

            byte[] fileBytes = System.IO.File.ReadAllBytes(path);
            if (!isBase64)
            {
                return File(fileBytes, "application/x-msdownload", Path.GetFileName(path));
            } else
            {
                String file = Convert.ToBase64String(fileBytes);
                return Ok(file);
            }
        }
    }
}