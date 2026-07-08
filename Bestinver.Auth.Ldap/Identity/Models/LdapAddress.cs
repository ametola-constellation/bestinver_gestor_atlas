using System;
using System.Collections.Generic;
using System.Text;

namespace Bestinver.Auth.Ldap.Identity.Models
{
    public class LdapAddress
    {
        public string Street { get; set; }
        public string PostalCode { get; set; }
        public string City { get; set; }
        public string StateName { get; set; }
        public string CountryName { get; set; }
        public string CountryCode { get; set; }
    }
}
