using Bestinver.Auth.Ldap.Identity.Models;
using Bestinver.Auth.Ldap.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Bestinver.Auth.Ldap.Services
{
    public interface IUserService
    {
        Task<IEnumerable<IdentityResult>> InitLdapUsers();

        Task<IEnumerable<ApplicationUser>> GetUsers();

        Task<IdentityResult> AddUser(string userId);

        Task<IdentityResult> RemoveUser(string userId);

        Task<IdentityResult> AddUserToRole(string userId, string roleName);

        Task<IdentityResult> RemoveUserToRole(string userId, string roleName);

        Task<IdentityResult> RemoveUserRoles(string userId);

        Task<IdentityResult> SyncLdapUser(string userName);

        Task<IdentityResult> SyncLdapUserClaims(ApplicationUser user, LdapUser ldapUser);
    }
}