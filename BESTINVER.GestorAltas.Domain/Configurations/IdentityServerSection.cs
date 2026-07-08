using BESTINVER.GestorAltas.Web.Management.Common;

namespace BESTINVER.GestorAltas.Domain.Configurations
{
    public class IdentityServerSection : IIdentityServerSection
    {
        public string Authority { get; set; }

        public string ClientId { get; set; }

        public string ClientSecret { get; set; }

        public string Scopes { get; set; }
    }
}