using Bestinver.Auth.Ldap.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bestinver.Auth.Ldap.Identity
{
    public class LdapRoleManager : RoleManager<IdentityRole>
    {
        private readonly IGraphService ldapService;
        public LdapRoleManager(
            IGraphService ldapService,
            IRoleStore<IdentityRole> store,
            IEnumerable<IRoleValidator<IdentityRole>> roleValidators,
            ILookupNormalizer keyNormalizer,
            IdentityErrorDescriber errors,
            ILogger<LdapRoleManager> logger) : base(
                store,
                roleValidators,
                keyNormalizer,
                errors,
                logger)
        {
            this.ldapService = ldapService;
        }
    }
}
