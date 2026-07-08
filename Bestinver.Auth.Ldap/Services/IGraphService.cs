using Bestinver.Auth.Ldap.Identity.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bestinver.Auth.Ldap.Services
{
    public interface IGraphService
    {
        Task<LdapUser> GetUserByAccountName(string accountName);
        Task<bool> IsInGroupAdmin(string distinguishedName);
        Task<IEnumerable<LdapUser>> GetUsersInGroup();
        Task<LdapUser> GetUserById(string id);
        Task<LdapUser> GetUserByEmail(string email);
    }
}
