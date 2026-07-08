using Bestinver.Auth.Ldap.Identity.Models;
using Bestinver.Auth.Ldap.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bestinver.Auth.Ldap.Services
{
    public class GraphService : IGraphService
    {
        #region members

        private readonly GraphSettings _graphSettings;
        private readonly ILogger<GraphService> logger;
        private readonly GraphServiceClient _graphServiceClient;

        private readonly string[] attributes =  {
            "userPrincipalName",
            "onPremisesSecurityIdentifier",
            "onPremisesDistinguishedName",
            "id",
            "onPremisesSamAccountName",
            "mail",
            "displayName",
            "jobTitle",
            "department"
        };

        #endregion members

        #region public methods

        public GraphService(
            IOptions<GraphSettings> graphSettings,
            ILogger<GraphService> logger,
            GraphServiceClient graphServiceClient)
        {
            this.logger = logger;
            _graphServiceClient = graphServiceClient;
            _graphSettings = graphSettings.Value;
        }


        public async Task<ICollection<LdapGroup>> GetGroups(string groupName, bool getChildGroups = false)
        {
            var groups = new List<LdapGroup>();

            var azGroups = await _graphServiceClient.Groups.GetAsync(requestConfiguration =>
            {
                requestConfiguration.QueryParameters.Filter = $"startswith(DisplayName,'{groupName}')";
            });

            foreach (var group in azGroups.Value)
            {
                var members = await GetUserMembers(group.Id, getChildGroups);
                groups.Add(new LdapGroup
                {
                    CommonName = group.DisplayName,
                    DistinguishedName = group.Id,
                    Members = members.Select(x => GetLdapUserFromUser(x)).ToList()
                });
            }

            return groups;
        }


        public async Task<bool> IsInGroupAdmin(string distinguishedName)
        {
            return await GetUserInGroup(distinguishedName, _graphSettings.Group.Admin);
        }

        public async Task<IEnumerable<LdapUser>> GetUsersInGroup()
        {
            return await GetUsersInGroup(_graphSettings.Group.Users);
        }

        public async Task<LdapUser> GetUserByAccountName(string accountName)
        {
            var filter = $"onPremisesSamAccountName eq '{accountName}'";
            return await GetUser(filter);
        }

        public async Task<LdapUser> GetUserById(string id)
        {
            var filter = $"onPremisesSecurityIdentifier eq '{id}'";
            return await GetUser(filter);
        }

        public async Task<LdapUser> GetUserByEmail(string email)
        {
            var filter = $"userPrincipalName eq '{email}'";
            return await GetUser(filter);
        }

        #endregion public methods

        #region private methods
        private async Task<List<User>> GetUserMembers(string groupId, bool getChildGroups)
        {
            List<User> users = new List<User>();
            var directUserMembers = await _graphServiceClient.Groups[groupId].Members.GraphUser.GetAsync((requestConfiguration) =>
            {
                requestConfiguration.QueryParameters.Select = attributes;
            }
            );
            users.AddRange(directUserMembers.Value);

            while (directUserMembers.OdataNextLink != null)
            {
                directUserMembers = await _graphServiceClient.Groups[groupId].Members.GraphUser.WithUrl(directUserMembers.OdataNextLink).GetAsync();

                users.AddRange(directUserMembers.Value);
            }
            if (getChildGroups)
            {
                var groupMembers = await _graphServiceClient.Groups[groupId].Members.GraphGroup.GetAsync();
                foreach (var group in groupMembers.Value)
                {
                    users.AddRange(await GetUserMembers(group.Id, getChildGroups));
                }
            }
            return users;
        }
        private LdapUser GetLdapUserFromUser(User user)
        {
            return new LdapUser
            {
                ObjectSid = user.OnPremisesSecurityIdentifier,
                DistinguishedName = user.OnPremisesDistinguishedName,
                SamAccountName = user.OnPremisesSamAccountName,
                EmailAddress = user.Mail,
                DisplayName = user.DisplayName,
                JobTitle = user.JobTitle,
                Department = user.Department,
                UserPrincipalName = user.UserPrincipalName,
            };

        }
        private async Task<LdapUser> GetUser(string filter)
        {
            var users = (await _graphServiceClient.Users.GetAsync(requestConfiguration =>
            {
                requestConfiguration.QueryParameters.Select = attributes;
                requestConfiguration.QueryParameters.Filter = filter;
            })).Value;

            if (users != null && users.Any())
            {
                var user = users.First();
                return GetLdapUserFromUser(user);
            }
            return null;
        }

        private async Task<List<LdapUser>> GetUsersInGroup(string groupDistinguishedName)
        {
            var groups = await GetGroups(groupDistinguishedName);
            var group = groups.SingleOrDefault();
            try
            {
                return group.Members;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error SecurityService-GetUsersInGroup (list users): {Message}", ex.Message);
                return [];
            }

        }

        private async Task<bool> GetUserInGroup(string userDistinguishedName, string groupDistinguishedName)
        {
            var groups = await GetGroups(groupDistinguishedName);
            var group = groups.SingleOrDefault();
            if (group == null)
            {
                logger.LogDebug("Group {GroupDistinguishedName} not found.", groupDistinguishedName);
                return false;
            }
            return group.Members.Any(x => x.DistinguishedName == userDistinguishedName);
        }

        #endregion private methods
    }
}