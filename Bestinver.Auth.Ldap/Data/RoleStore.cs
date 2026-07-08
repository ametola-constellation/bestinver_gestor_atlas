using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bestinver.Auth.Ldap.Data
{
    public class RoleStore : RoleStore<IdentityRole>
    {
        public RoleStore(ApplicationDbContext context, Microsoft.AspNetCore.Identity.IdentityErrorDescriber describer = null) : base(context, describer)
        {
        }
    }
}
