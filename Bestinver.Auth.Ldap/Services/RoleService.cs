using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Bestinver.Auth.Ldap.Services
{
    public class RoleService : IRoleService
    {

        private readonly RoleManager<IdentityRole> roleManager;

        public RoleService(RoleManager<IdentityRole> roleManager)
        {
            this.roleManager = roleManager;
        }

        public async Task<IdentityResult> AddClaim(string roleName, string claimType, string claimName)
        {
            var role = await roleManager.FindByNameAsync(roleName).ConfigureAwait(false);
            var claim = new Claim(claimType, claimName);
            return await roleManager.AddClaimAsync(role, claim);
        }

        public async Task<IdentityResult> CreateRole(string roleName)
        {
            var role = new IdentityRole { Name = roleName };
            return await roleManager.CreateAsync(role).ConfigureAwait(false);
        }

        public async Task<IEnumerable<Claim>> GetClaims(string roleName)
        {
            var role = await roleManager.FindByNameAsync(roleName).ConfigureAwait(false);
            return await roleManager.GetClaimsAsync(role).ConfigureAwait(false);
        }

        public async Task<IEnumerable<IdentityRole>> GetRoles()
        {
            var roleCollecion = roleManager.Roles;
            var roles = from r in roleCollecion
                        select new IdentityRole { Id = r.Id, Name = r.Name };

            return await roles.ToListAsync();
        }

        public async Task<IdentityResult> RemokeClaim(string roleName, string claimType, string claimName)
        {
            var role = await roleManager.FindByNameAsync(roleName).ConfigureAwait(false);
            var claim = new Claim(claimType, claimName);
            return await roleManager.RemoveClaimAsync(role, claim);
        }

        public async Task<IdentityResult> RemoveRole(string roleName)
        {
            var role = await roleManager.FindByNameAsync(roleName).ConfigureAwait(false);
            return await roleManager.DeleteAsync(role).ConfigureAwait(false);
        }
    }
}
