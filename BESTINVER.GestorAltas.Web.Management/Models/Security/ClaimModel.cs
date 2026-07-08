using System.Collections.Generic;
using System.Security.Claims;

namespace BESTINVER.GestorAltas.Web.Management.Models.Security
{
    public class ClaimModel : Claim
    {
        public ClaimModel() : base("", "")
        {
        }

        public new string Type { get; set; }
        public new string Value { get; set; }
        public new string OriginalIssuer { get; set; }
        public new string Issuer { get; set; }
        public new string ValueType { get; set; }
        public new ClaimsIdentity Subject { get; set; }
        public new IDictionary<string, string> Properties { get; set; }
    }
}