using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bestinver.Auth.Ldap.Identity.Policy
{
    public class AllowPrivatePolicy : IAuthorizationRequirement
    {
    }

    public class AllowPrivateHandler : AuthorizationHandler<AllowPrivatePolicy>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AllowPrivatePolicy requirement)
        {
            string policyName = context.Resource as String;

            var claim = context.User.Claims.Any(c => c.Value == policyName);

            if (claim)
            {
                context.Succeed(requirement);
            }
            else
            {
                context.Fail();
            }

            return Task.CompletedTask;
        }
    }
}
