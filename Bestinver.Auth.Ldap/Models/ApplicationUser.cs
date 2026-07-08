using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Bestinver.Auth.Ldap.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string JobTitle { get; set; }
        public string Department { get; set; }

        [NotMapped]
        public IEnumerable<string> Roles { get; set; }

    }
}
