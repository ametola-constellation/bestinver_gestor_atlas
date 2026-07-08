using Bestinver.Auth.Ldap.Models;
using BestInver.Core.Utils.Helpers;
using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Web;

namespace BESTINVER.GestorAltas.Web.Management.Controllers
{
    [Route("[controller]/[action]")]
    [Authorize]
    public class SharedController : TimezoneController
    {
        private readonly ISharedService sharedService;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly AzureAdSettings _azureAdSettings;
        private readonly AppSettings _appSettings;

        public SharedController(
            ISharedService sharedService,
            IHttpContextAccessor httpContextAccessor,
            SignInManager<ApplicationUser> signInManager,
            IOptionsSnapshot<AzureAdSettings> azureAdSettings,
            IOptions<AppSettings> appSettings)
        {
            this.sharedService = sharedService;
            this.httpContextAccessor = httpContextAccessor;
            this.signInManager = signInManager;
            _azureAdSettings = azureAdSettings.Value;
            _appSettings = appSettings.Value;
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpPost]
        public async Task<IActionResult> Echo()
        {
            string body;
            using (var stream = new StreamReader(httpContextAccessor.HttpContext.Request.Body))
            {
                body = await stream.ReadToEndAsync();
                body += $" clientIp: {httpContextAccessor.HttpContext.Request.GetClientIP()}";
            }
            return Ok(body);
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public IActionResult SessionDiv()
        {
            return PartialView("_SessionDiv");
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public IActionResult Refresh()
        {
            return PartialView("_Refresh");
        }

        [HttpGet("{encryptedUrl}/{fileName}")]
        public async Task<IActionResult> OpenFile(string encryptedUrl, string fileName)
        {
            // Decodifica la url para comprobar si está intentando acceder a un servidor antiguo.
            try
            {
                var aes256Key = _appSettings.Aes256Key;
                var url = CryptAes256Helper.DecryptUrl(encryptedUrl, aes256Key);

                if (url.Contains("bestinver.kimak", StringComparison.OrdinalIgnoreCase) || url.Contains("api.otpsecure", StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound();
                }
            }
            catch (Exception)
            {
                return NotFound();
            }

            var file = await sharedService.DownloadFile(encryptedUrl, fileName);

            if (file == null)
            {
                return NotFound();
            }

            file.FileDownloadName = null;
            return file;
        }

        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            await signInManager.SignOutAsync().ConfigureAwait(false);

            // Redirect to Azure AD logout endpoint
            var postLogoutRedirectUri = Url.Action("Index", "Home", null, Request.Scheme);
            var logoutUrl = $"{_azureAdSettings.Instance}{_azureAdSettings.TenantId}/oauth2/v2.0/logout?post_logout_redirect_uri={postLogoutRedirectUri}";
            return Redirect(logoutUrl);
        }
    }
}
