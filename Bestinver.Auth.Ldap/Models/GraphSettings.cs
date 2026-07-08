using System;
using System.Collections.Generic;
using System.Text;

namespace Bestinver.Auth.Ldap.Models
{
    public class GraphSettings
    {
        public string TenantId { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public GraphSearchGroup Group { get; set; }
        
    }
}
