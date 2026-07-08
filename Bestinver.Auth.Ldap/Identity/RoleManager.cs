using Bestinver.Auth.Ldap.Data;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace Microsoft.AspNetCore.Authorization
{
    public class RoleManagerBD
    {
        private ApplicationDbContext dbcontext;

        public RoleManagerBD(ApplicationDbContext dbcontext)
        {
            this.dbcontext = dbcontext;
        }

        public void SetRoles(ClaimsPrincipal principal)
        {
            if (principal?.Identity != null && principal.Identity.IsAuthenticated)
            {
                if (!principal.Claims.Any(c => c.Type == MiddleOfficePermissionNames.MiddleOfficePermission))
                {
                    var appIdentity = new ClaimsIdentity(GetRoles(principal.Identity.Name));
                    principal.AddIdentity(appIdentity);
                }
            }
        }

        public List<Claim> GetRoles(string userId)
        {
            var result = new List<Claim>();

            var roles = dbcontext.UserRoles.Where(u => u.UserId.Equals(userId, StringComparison.Ordinal));
            if (roles.Any())
            {
                var role = roles.FirstOrDefault();
                var roleName = dbcontext.Roles.FirstOrDefault(r => r.Id == role.RoleId);
                var claims = dbcontext.RoleClaims.Where(c => c.RoleId == role.RoleId);
                result.Add(new Claim(ClaimTypes.Role, roleName.Name));
                result.Add(new Claim(ClaimTypes.Email, userId));

                foreach (var c in claims)
                {                    
                    result.Add(new Claim(MiddleOfficePermissionNames.MiddleOfficePermission, c.ClaimValue));

                }
            }

            return result;
        }
    }
}
