using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Microsoft.AspNetCore.Authorization
{
    public static class MiddleOfficePolicies
    {
        public static void AddMiddleOfficePolicies(this AuthorizationOptions options)
        {
            typeof(MiddleOfficeClaimNames).GetFields().ToList().ForEach(x =>
            {
                var claimValue = x.GetValue(null).ToString();
                options.AddPolicy(claimValue, policy => policy.RequireClaim("middle-office-permission", claimValue));
            });
        }
    }
}
