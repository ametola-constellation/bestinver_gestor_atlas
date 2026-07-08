using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Bestinver.Auth.Ldap.Services
{
    public interface IRoleService
    {
        Task<IEnumerable<IdentityRole>> GetRoles();
        Task<IEnumerable<Claim>> GetClaims(string roleName);
        Task<IdentityResult> CreateRole(string roleName);
        Task<IdentityResult> AddClaim(string roleName, string claimType, string claimName);
        Task<IdentityResult> RemokeClaim(string roleName, string claimType, string claimName);
        Task<IdentityResult> RemoveRole(string roleName);

    }
}
