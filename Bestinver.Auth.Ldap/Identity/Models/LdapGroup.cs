using System;
using System.Collections.Generic;
using System.Text;

namespace Bestinver.Auth.Ldap.Identity.Models
{
    public class LdapGroup : LdapEntry
    {
        public List<LdapUser> Members { get; set; }
    }
}
