using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

#nullable enable
namespace BESTINVER.GestorAltas.Web.Common.Models
{

    public class LoginViewModel
    {
        public IEnumerable<string> Errors { get; set; }= Enumerable.Empty<string>();
        public bool Redirect { get; set; }

        public string? ReturnUrl { get; set; }
        public bool AllowRememberLogin { get; set; } = true;

        public bool EnableLocalLogin { get; set; } = true;

        public LoginResolutionPolicy LoginResolutionPolicy { get; set; } = LoginResolutionPolicy.Username;

        public IEnumerable<LoginViewModel.ExternalProvider> ExternalProviders { get; set; } = Enumerable.Empty<ExternalProvider>();

        public IEnumerable<LoginViewModel.ExternalProvider> VisibleExternalProviders => ExternalProviders.Where(x => !String.IsNullOrWhiteSpace(x.DisplayName));

        public bool IsExternalLoginOnly => EnableLocalLogin == false && ExternalProviders?.Count() == 1;

        public string? ExternalLoginScheme => IsExternalLoginOnly ? ExternalProviders?.SingleOrDefault()?.AuthenticationScheme : null;

        public class ExternalProvider
        {
            public ExternalProvider(string authenticationScheme, string? displayName = null)
            {
                AuthenticationScheme = authenticationScheme;
                DisplayName = displayName;
            }

            public string? DisplayName { get; set; }

            public string AuthenticationScheme { get; set; }
        }
    }
}
