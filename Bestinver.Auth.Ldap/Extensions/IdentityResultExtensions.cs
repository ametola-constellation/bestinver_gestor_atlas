using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Bestinver.Auth.Ldap.Extensions
{
    public static class IdentityResultExtensions
    {
        public static IdentityResult ValidateUserResults(List<IdentityResult> results, string errormessage = "")
        {
            IdentityResult result = IdentityResult.Success;
            if (results.Any(r => !r.Succeeded))
            {
                IdentityError[] errors = { new IdentityError { Description = errormessage } };
                result = IdentityResult.Failed(errors: errors);
            }
            return result;
        }
    }
}
