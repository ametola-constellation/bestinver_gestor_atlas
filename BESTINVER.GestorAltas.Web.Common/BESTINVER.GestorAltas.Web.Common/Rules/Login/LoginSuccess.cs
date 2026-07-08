using bestinver.crossapp.common.rules;
using Bestinver.Auth.Ldap.Models;
using Bestinver.Auth.Ldap.Services;
using BESTINVER.GestorAltas.Web.Common.Exceptions;
using BESTINVER.GestorAltas.Web.Common.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Common.Rules.Login
{
    internal class LoginSuccess : IRule<LoginRequest>
    {
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly IUserService userService;
        private readonly ILogger<LoginSuccess> logger;

        public LoginSuccess(SignInManager<ApplicationUser> signInManager, IUserService userService, ILogger<LoginSuccess> logger)
        {
            this.signInManager = signInManager;
            this.userService = userService;
            this.logger = logger;
        }

        public async Task<bool> Check(LoginRequest obj)
        {
            try
            {
                bool loginok = false;
                var resultSync = await userService.SyncLdapUser(obj.Name).ConfigureAwait(false);
                if (resultSync.Succeeded)
                {
                    var result = await signInManager.PasswordSignInAsync(obj.Name, obj.Password, false, false).ConfigureAwait(false);
                    loginok = result.Succeeded;
                    if (!loginok)
                    {
                        throw new LoginFailedException();
                    }
                }
                else
                {
                    throw new SyncFailedException();
                }

                return loginok;
            }
            catch (LoginFailedException)
            {
                throw;
            }
            catch (SyncFailedException)
            {
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error login: {ex.Message}");
                throw new GenericLoginException();
            }
        }
    }
}