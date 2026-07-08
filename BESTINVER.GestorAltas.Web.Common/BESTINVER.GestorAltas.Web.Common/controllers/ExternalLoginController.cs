using Bestinver.Auth.Ldap.Identity.Models;
using Bestinver.Auth.Ldap.Models;
using Bestinver.Auth.Ldap.Services;
using BESTINVER.GestorAltas.Web.Common.Extensions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

#nullable enable
namespace BESTINVER.GestorAltas.Web.Common.controllers
{
    [Route("ExternalLogin")]
    public class ExternalLoginController : _base.ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<ExternalLoginController> _logger;
        private readonly IGraphService _graphService;
        private readonly IUserService _userService;

        public ExternalLoginController(SignInManager<ApplicationUser> signInManager,
                                       UserManager<ApplicationUser> userManager,
                                       ILogger<ExternalLoginController> logger,
                                       IGraphService graphService,
                                       IUserService userService)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _logger = logger;
            _graphService = graphService;
            _userService = userService;
        }

        [HttpGet("ExternalLogin")]
        public IActionResult Index(string scheme, string? returnUrl = null)
        {
            // Request a redirect to the external login provider.
            var redirectUrl = Url.ActionLink("Callback", values: new { returnUrl });

            var failRedirectUrl = Url.ActionLink("AccessDenied", "Login", new { returnUrl }); // TO-DO: sould we redirect to failure page?

            var properties = _signInManager.ConfigureExternalAuthenticationProperties(scheme, redirectUrl);
            properties.SetString(".failRedirect", failRedirectUrl);

            return Challenge(properties, scheme);
        }
        public async Task<IActionResult> Callback(string? returnUrl = null, string? remoteError = null)
        {
            _logger.LogDebug("ReturnUrl: {ReturnUrl}", returnUrl);
            _logger.LogDebug("RemoteError: {RemoteError}", remoteError);

            if (remoteError != null)
            {
                ModelState.AddModelError(string.Empty, remoteError);
                return RedirectToAction("Index", "Login");
            }

            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                return RedirectToAction("Index", "Login", new { returnUrl });
            }
            _logger.LogDebug("GetExternalLoginInfoAsync: {Info}", info);

            var email = info.Principal.FindFirstValue("preferred_username");
            var name = info.Principal.FindFirstValue("onpremisessamaccountname");
            var onpremiseId = info.Principal.FindFirstValue("onprem_sid");

            var userGraph = await GetUserGraphIfNeeded(onpremiseId, email);
            if (userGraph != null && name == null)
            {
                name = userGraph.UserName;
            }

            if (onpremiseId == null && userGraph != null)
            {
                onpremiseId = userGraph.Id;
            }

            var user = await FindUserAsync(onpremiseId, email, name);
            _logger.LogDebug("User: {User}", user);

            var isPersistent = false;
            var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: isPersistent, bypassTwoFactor: true);
            _logger.LogDebug("ExternalLoginSignInAsync: {Result}", result);

            if (result.Succeeded)
            {
                return await HandleSucceededLoginAsync(info, email, isPersistent, returnUrl);
            }

            if (user != null)
            {
                return await HandleExistingUserAsync(user, info, isPersistent, returnUrl);
            }

            return await HandleNewUserAsync(userGraph, onpremiseId, name, email, info, isPersistent, returnUrl);
        }

        private async Task<LdapUser?> GetUserGraphIfNeeded(string? onpremiseId, string? email)
        {
            if (onpremiseId != null)
            {
                return await _graphService.GetUserById(onpremiseId);
            }
            else if(email != null)
            {
                return await _graphService.GetUserByEmail(email);
            }

            return null;
        }

        private async Task<ApplicationUser?> FindUserAsync(string? onpremiseId, string? email, string? name)
        {
            ApplicationUser? user = null;
            if (!string.IsNullOrEmpty(onpremiseId))
            {
                user = await _userManager.FindByIdAsync(onpremiseId);
            }
            if (user == null && !string.IsNullOrEmpty(email))
            {
                user = await _userManager.FindByEmailAsync(email);
            }
            if (user == null && !string.IsNullOrEmpty(name))
            {
                user = await _userManager.FindByNameAsync(name);
            }
            return user;
        }

        private async Task<IActionResult> HandleSucceededLoginAsync(ExternalLoginInfo info, string? email, bool isPersistent, string? returnUrl)
        {
            var identityDbUser = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
            if (identityDbUser is not null)
            {
                if (!string.IsNullOrEmpty(email))
                {
                    identityDbUser.Email = email;
                    await _userManager.UpdateAsync(identityDbUser);
                    await _signInManager.UpdateExternalAuthenticationTokensAsync(info!);
                }
                await _signInManager.SignInAsync(identityDbUser, isPersistent);
                await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

                _logger.LogDebug("Redirect 1: {ReturnUrl}", returnUrl ?? "~/");
                return LocalRedirect(returnUrl ?? "~/");
            }
            _logger.LogDebug("Redirect 4 AccessDenied");
            return RedirectToAction("AccessDenied", "Login");
        }

        private async Task<IActionResult> HandleExistingUserAsync(ApplicationUser user, ExternalLoginInfo info, bool isPersistent, string? returnUrl)
        {
            var addLoginResult = await _userManager.AddLoginAsync(user, info!);
            if (addLoginResult.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: isPersistent);
                await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);
                _logger.LogDebug("Redirect 2: {ReturnUrl}", returnUrl ?? "~/");
                return LocalRedirect(returnUrl ?? "~/");
            }
            addLoginResult.AddErrors(ModelState);
            _logger.LogDebug("Redirect 4 AccessDenied");
            return RedirectToAction("AccessDenied", "Login");
        }

        private async Task<IActionResult> HandleNewUserAsync(LdapUser? userGraph, string? onpremiseId, string? name, string? email, ExternalLoginInfo info, bool isPersistent, string? returnUrl)
        {
            var user = new ApplicationUser()
            {
                Id = string.IsNullOrEmpty(onpremiseId) ? Guid.NewGuid().ToString() : onpremiseId,
                UserName = name,
                Email = email
            };
            if (userGraph != null)
            {
                user.JobTitle = userGraph.JobTitle;
                user.Department = userGraph.Department;
            }
            var userResult = await _userManager.CreateAsync(user);
            _logger.LogDebug("UserResult: {UserResult}", userResult);
            if (userResult.Succeeded)
            {
                if (userGraph != null)
                {
                    await _userService.SyncLdapUserClaims(user, userGraph);
                }

                userResult = await _userManager.AddLoginAsync(user, info);
                if (userResult.Succeeded)
                {
                    await _signInManager.SignInAsync(user, isPersistent: isPersistent);
                    await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);
                    _logger.LogDebug("Redirect 3: {ReturnUrl}", returnUrl ?? "~/");
                    return LocalRedirect(returnUrl ?? "~/");
                }
            }
            userResult.AddErrors(ModelState);
            _logger.LogDebug("Redirect 4 AccessDenied");
            return RedirectToAction("AccessDenied", "Login");
        }
    }
}
