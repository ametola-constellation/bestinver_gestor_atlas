using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;

namespace BESTINVER.GestorAltas.Web.Common.Extensions
{
    public static class IdentityResultExtensions
    {
        public static void AddErrors(this IdentityResult result, ModelStateDictionary modelState)
        {
            ArgumentNullException.ThrowIfNull(result, nameof(result));
            ArgumentNullException.ThrowIfNull(modelState, nameof(modelState));

            foreach (var error in result.Errors)
            {
                modelState.AddModelError(string.Empty, error.Description);
            }
        }
    }
}
