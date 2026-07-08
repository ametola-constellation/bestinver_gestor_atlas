using Bestinver.Auth.Ldap.Identity.Models;
using Bestinver.Auth.Ldap.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bestinver.Auth.Ldap.Extensions
{
    public static class LdapUserExtensions
    {
        public static ApplicationUser ToApplicationUser(this LdapUser ldapuser)
        {
            return new ApplicationUser
            {
                Department = ldapuser.Department,
                Email = ldapuser.Email,
                Id = ldapuser.Id,
                JobTitle = ldapuser.JobTitle,
                NormalizedEmail = ldapuser.NormalizedEmail,
                UserName = ldapuser.UserName,
                Roles = ldapuser.MemberOf,
                AccessFailedCount = ldapuser.AccessFailedCount,
                ConcurrencyStamp = ldapuser.ConcurrencyStamp,
                EmailConfirmed = ldapuser.EmailConfirmed,
                LockoutEnabled = ldapuser.LockoutEnabled,
                LockoutEnd = ldapuser.LockoutEnd,
                NormalizedUserName = ldapuser.NormalizedUserName,
                PasswordHash = ldapuser.PasswordHash,
                PhoneNumber = ldapuser.PhoneNumber,
                PhoneNumberConfirmed = ldapuser.PhoneNumberConfirmed,
                SecurityStamp = ldapuser.SecurityStamp,
                TwoFactorEnabled = ldapuser.TwoFactorEnabled
            };
        }
    }
}
