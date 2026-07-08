using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BESTINVER.GestorAltas.Domain.Interfaces;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace BESTINVER.GestorAltas.Web.Public.Controllers
{
    public class HomeController : Controller
    {
        private readonly IAppSettings settings;

        public HomeController(IAppSettings settings)
        {
            this.settings = settings;
        }

        public IActionResult Index(string id)
        {
            return CheckRedirection(id);
        }

        private ActionResult CheckRedirection(string id)
        {
            int idNum = 0;

            if (!string.IsNullOrEmpty(id))
            {
                bool isNumeric = int.TryParse(id, out idNum);

                if (!isNumeric)
                {
                    RouteData.Values.Remove("id");
                    return RedirectToAction("Index");
                }
            }

            if (idNum == (int)ProductTypes.PP || idNum == (int)ProductTypes.EPSV)
            {
                return RedirectToAction("Index", "Register", new { id, modal = "S" });
            }
            else if (settings.IsJuridicOnlyInAssistMode)
            {
                if (User.Identity.IsAuthenticated)
                {
                    return View("Index");
                }
                else
                {
                    return RedirectToAction("Index", "Register");
                }
            }
            else
            {
                return View("Index");
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}