using Bestinver.Auth.Ldap.Models;
using BESTINVER.GestorAltas.Web.Management.Models;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {        
        public HomeController(IOptions<RequestLocalizationOptions> options)
        {
            Options = options;            
        }

        public ActionResult Logout()
        {            
            return RedirectToAction("Logout", "Shared");
        }

        public IOptions<RequestLocalizationOptions> Options { get; }

        [HttpGet]
        public IActionResult Index() => View();
        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult SetLanguage(LanguageModel model)
        {
            if (ModelState.IsValid)
            {
                Response.Cookies.Append(
               CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(model.Culture, model.Culture)),
                new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) });
                return Ok(Url.IsLocalUrl(model.ReturnUrl));
            }

            return BadRequest(model);
        }

        public IActionResult Error()
        {
            return View(new BESTINVER.GestorAltas.Web.Models.ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }       
    }
}