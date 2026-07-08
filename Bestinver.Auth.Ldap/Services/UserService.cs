using Bestinver.Auth.Ldap.Extensions;
using Bestinver.Auth.Ldap.Identity.Models;
using Bestinver.Auth.Ldap.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bestinver.Auth.Ldap.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IGraphService graphService;

        public UserService(UserManager<ApplicationUser> userManager, IGraphService graphService)
        {
            this.userManager = userManager;
            this.graphService = graphService;
        }

        public async Task<IdentityResult> AddUser(string userId)
        {
            var user = await userManager.FindByIdAsync(userId).ConfigureAwait(false);
            return await userManager.CreateAsync(user).ConfigureAwait(false);
        }

        public async Task<IEnumerable<ApplicationUser>> GetUsers()
        {
            var result = userManager.Users.ToList();

            foreach (var user in result)
            {
                user.Roles = await userManager.GetRolesAsync(user).ConfigureAwait(false);
            }

            return result;
        }

        public async Task<IEnumerable<IdentityResult>> InitLdapUsers()
        {
            var registerModels = await graphService.GetUsersInGroup();
            var results = new List<IdentityResult>();

            foreach (var x in registerModels)
            {
                try
                {
                    var ldapuser = await userManager.FindByIdAsync(x.Id).ConfigureAwait(false);
                    if (ldapuser == null)
                    {
                        var user = new ApplicationUser
                        {
                            //****************************************************************************************************************
                            // We use userprincipalname in case there are external users without email, so that synchronization does not fail
                            //****************************************************************************************************************
                            Email = x.Email != null ? x.Email : x.UserPrincipalName,
                            Id = x.Id,
                            UserName = x.UserName,
                            PasswordHash = x.PasswordHash,
                            JobTitle = x.JobTitle,
                            Department = x.Department
                        };
                        var result = await userManager.CreateAsync(user);

                        if (result.Succeeded)
                        {
                            await this.SyncLdapUserClaims(user,x).ConfigureAwait(false);
                        }

                        results.Add(result);
                    }
                }
                catch
                {
                    results.Add(IdentityResult.Failed());
                }
            }

            return results;
        }

        public async Task<IdentityResult> RemoveUser(string userId)
        {
            var user = await userManager.FindByIdAsync(userId).ConfigureAwait(false);
            return await userManager.DeleteAsync(user).ConfigureAwait(false);
        }

        public async Task<IdentityResult> AddUserToRole(string userId, string roleName)
        {
            var user = await userManager.FindByIdAsync(userId).ConfigureAwait(false);
            var result = await userManager.AddToRoleAsync(user, roleName).ConfigureAwait(false);
            return result;
        }

        public async Task<IdentityResult> RemoveUserToRole(string userId, string roleName)
        {
            var user = await userManager.FindByIdAsync(userId).ConfigureAwait(false);
            string[] userRoles = [roleName];
            var result = await userManager.RemoveFromRolesAsync(user, userRoles).ConfigureAwait(false);
            return result;
        }

        public async Task<IdentityResult> SyncLdapUserClaims(ApplicationUser user, LdapUser ldapUser)
        {
            var userDB = await userManager.FindByNameAsync(user.UserName).ConfigureAwait(false);
            IdentityResult result = IdentityResult.Success;

            var userIsAdmin = await userManager.IsInRoleAsync(userDB, DefaultRoles.Admin).ConfigureAwait(false);
            if (await graphService.IsInGroupAdmin(ldapUser.DistinguishedName) && !userIsAdmin)
            {
                result = await userManager.AddToRoleAsync(userDB, DefaultRoles.Admin).ConfigureAwait(false);
            }

            if (!await graphService.IsInGroupAdmin(ldapUser.DistinguishedName) && userIsAdmin)
            {
                result = await userManager.RemoveFromRoleAsync(userDB, DefaultRoles.Admin).ConfigureAwait(false);
            }

            return result;
        }

        public async Task<IdentityResult> RemoveUserRoles(string userId)
        {
            var user = await userManager.FindByIdAsync(userId).ConfigureAwait(false);
            var userRoles = await userManager.GetRolesAsync(user).ConfigureAwait(false);
            var result = await userManager.RemoveFromRolesAsync(user, userRoles).ConfigureAwait(false);
            return result;
        }

        public async Task<IdentityResult> SyncLdapUser(string userName)
        {
            var ldapUser = await graphService.GetUserByAccountName(userName);
            List<IdentityResult> userResults = [];

            if (ldapUser == null)
            {
                return IdentityResult.Failed();
            }

            var user = await userManager.FindByNameAsync(userName).ConfigureAwait(false);

            if (user == null)
            {
                var resultCreate = await userManager.CreateAsync(ldapUser.ToApplicationUser()).ConfigureAwait(false);
                userResults.Add(resultCreate);
            }
            else
            {
                user.JobTitle = ldapUser.JobTitle;
                user.Department = ldapUser.Department;
                user.Email = ldapUser.Email;
                user.NormalizedEmail = ldapUser.NormalizedEmail;
                user.PasswordHash = ldapUser.PasswordHash;
                var resultUpdate = await userManager.UpdateAsync(user).ConfigureAwait(false);
                userResults.Add(resultUpdate);
            }

            var resultsync = await SyncLdapUserClaims(ldapUser.ToApplicationUser(), ldapUser).ConfigureAwait(false);
            userResults.Add(resultsync);

            return IdentityResultExtensions.ValidateUserResults(userResults, "Error al sincronizar el usuario"); 
        }
    }
}