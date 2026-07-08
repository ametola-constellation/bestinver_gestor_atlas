using bestinver.crossapp.common.rules;
using Bestinver.Auth.Ldap.Models;
using BESTINVER.GestorAltas.Web.Common.Models;
using BESTINVER.GestorAltas.Web.Common.Rules;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace BESTINVER.GestorAltas.Web.Common.controllers
{
    [Route("Account")]
    public class LoginController : _base.ControllerBase
    {
        private readonly IRuleProcessor<LoginRequest> ruleProcessor;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly IAuthenticationSchemeProvider _schemeProvider;
        private readonly LoginConfiguration _loginConfiguration;
        private readonly AzureAdSettings _azureAdSettings;

        public LoginController(
            IRuleProcessor<LoginRequest> ruleProcessor,
            SignInManager<ApplicationUser> signInManager,
            IAuthenticationSchemeProvider schemeProvider,
            LoginConfiguration loginConfiguration,
            IOptionsSnapshot<AzureAdSettings> azureAdSettings)
        {
            this.ruleProcessor = ruleProcessor;
            this.signInManager = signInManager;
            _schemeProvider = schemeProvider;
            _loginConfiguration = loginConfiguration;
            _azureAdSettings = azureAdSettings.Value;
        }

        /// <summary>
        /// Show login page
        /// </summary>
        /// <param name="returnUrl"></param>
        [HttpGet("Login")]
        public async Task<IActionResult> Index(string returnUrl)
        {
            if (string.IsNullOrEmpty(returnUrl) && !string.IsNullOrEmpty(Request.PathBase))
            {
                var pathBase = Request.PathBase.Value;
                if (!pathBase.EndsWith('/'))
                {
                    pathBase = pathBase + "/";
                }
                returnUrl = pathBase;
            }
            if (User.Identity.IsAuthenticated)
            {
                return Redirect(string.IsNullOrEmpty(returnUrl) ? "~/" : returnUrl);
            }
            return View("~/Views/Login.cshtml", await BuildModelAsync(returnUrl));
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Check(LoginRequest data)
        {
            IActionResult result = null;

            if (string.IsNullOrEmpty(data.ReturnUrl) && !string.IsNullOrEmpty(Request.PathBase))
            {
                var pathBase = Request.PathBase.Value;
                if (!pathBase.EndsWith('/'))
                {
                    pathBase = pathBase + "/";
                }
                data.ReturnUrl = pathBase;
            }
            data.Redirect = true;

            try
            {
                await ruleProcessor.CheckRules(data).ConfigureAwait(false);
            }
            catch (RuleException oEx)
            {
                data.Errors = oEx.Messages;
                data.ReturnUrl = null;
                data.Redirect = false;
            }
            catch
            {
                result = BadRequest();
                data.ReturnUrl = null;
                data.Redirect = false;
            }

            return result ?? View("~/Views/Login.cshtml", data);
        }

        private async Task<LoginViewModel> BuildModelAsync(string returnUrl)
        {
            var schemes = await _schemeProvider.GetAllSchemesAsync();

            var providers = schemes
                .Where(x => x.DisplayName != null)
                .Select(x => new LoginViewModel.ExternalProvider
                (
                    authenticationScheme: x.Name,
                    displayName: x.DisplayName ?? x.Name
                )).ToList();

            var allowLocal = false;
            
            return new LoginViewModel
            {
                ReturnUrl = returnUrl,
                AllowRememberLogin = LoginOptions.AllowRememberLogin,
                EnableLocalLogin = allowLocal && LoginOptions.AllowLocalLogin,
                LoginResolutionPolicy = _loginConfiguration.ResolutionPolicy,
                ExternalProviders = providers.ToArray()
            };
        }

        /// <summary>
        /// Show logout page
        /// </summary>
        /// <param name="returnUrl"></param>
        [HttpGet("Logout")]
        public IActionResult Logout(string returnUrl)
        {
            if (string.IsNullOrEmpty(returnUrl) && !string.IsNullOrEmpty(Request.PathBase))
            {
                var pathBase = Request.PathBase.Value;
                if (!pathBase.EndsWith('/'))
                {
                    pathBase = pathBase + "/";
                }
                returnUrl = pathBase;
            }
            return View("~/Views/Logout.cshtml", new LoginViewModel { ReturnUrl = returnUrl });
        }

        [HttpPost("Logout")]
        public async Task<IActionResult> CheckLogout(LoginRequest data)
        {
            if (string.IsNullOrEmpty(data.ReturnUrl) && !string.IsNullOrEmpty(Request.PathBase))
            {
                var pathBase = Request.PathBase.Value;
                if (!pathBase.EndsWith('/'))
                {
                    pathBase = pathBase + "/";
                }
                data.ReturnUrl = pathBase;
            }
            data.Redirect = true;

            await signInManager.SignOutAsync();

            // Redirect to Azure AD logout endpoint
            var postLogoutRedirectUri = Url.Action("Login", "Account", null, Request.Scheme);
            var logoutUrl = $"{_azureAdSettings.Instance}{_azureAdSettings.TenantId}/oauth2/v2.0/logout?post_logout_redirect_uri={postLogoutRedirectUri}";

            return Redirect(logoutUrl);
        }

        /// <summary>
        /// Show login page
        /// </summary>
        /// <param name="returnUrl"></param>
        [HttpGet("AccessDenied")]
        public IActionResult AccessDenied(string returnUrl)
        {
            return View("~/Views/AccessDenied.cshtml", new LoginViewModel { ReturnUrl = returnUrl });
        }

        [HttpPost("AccessDenied")]
        public IActionResult AccessDenied(LoginRequest data)
        {
            return View("~/Views/AccessDenied.cshtml", data);
        }
    }
}