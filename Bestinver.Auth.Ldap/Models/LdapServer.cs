using System;
using System.Collections.Generic;
using System.Text;

namespace Bestinver.Auth.Ldap.Models
{
    public class LdapServer
    {
        public int ConnectionOrder { get; set; }
        public bool IsActive { get; set; } = true;
        public string Name { get; set; }
        public int Port { get; set; } = 389;
        public bool UseSSL { get; set; }
        public LdapCredentials Credentials { get; set; }
    }
}
