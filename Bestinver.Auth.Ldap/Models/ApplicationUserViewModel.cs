using System;
using System.Collections.Generic;
using System.Text;

namespace Bestinver.Auth.Ldap.Models
{
    public class ApplicationUserViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<string> Roles { get; set; }
    }
}
