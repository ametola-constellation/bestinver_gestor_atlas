using System;
using System.Collections.Generic;
using System.Text;

namespace Bestinver.Auth.Ldap.Models
{
    public class LdapCredentials
    {
        public string DistinguishedName { get; set; }
        public string Password { get; set; }
    }
}
