using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Users;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.Web.Management.Common;
using Microsoft.AspNetCore.Http;
using System.Net.Http;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class UsersService : ApiHelperBase,IUsersService
    {      
        private const string baseAddress = "api/users";

        public UsersService(
            IHttpClientFactory httpClientFactory,
            IHttpContextAccessor httpContextAccessor,
            IIdentityServerSection identityServerSection) : base (httpClientFactory, httpContextAccessor, identityServerSection.Authority)
        {
           
        }

        public Task<PaginatedResult<User>> Search(PaginatedSearch<UserSearch> userSearch)
            => PostWebAPI<PaginatedResult<User>, UserSearch>($"{baseAddress}/search{userSearch.GetQueryString(typeof(UserSearch))}", userSearch.Search);

        public Task Unlock(int userId, RequestChannelType requestChannelType)
            => PostWebAPI($"{baseAddress}/unlock", new UnlockUser { UserId = userId, Audit = new UserOperationAudit(), ChannelType = new ChannelType { Id = ((int)requestChannelType).ToString() } });

        public Task ResetPassword(int userId, ResetPassword resetPassword)
            => PostWebAPI($"{baseAddress}/{userId}/resetPassword", resetPassword);

        public Task<PaginatedResult<UserHistory>> OperationHistory(PaginatedSearch<UserHistory> paginatedSearch)
            => PostWebAPI<PaginatedResult<UserHistory>, UserHistory>($"{baseAddress}/search{paginatedSearch.GetQueryString(typeof(UserHistory))}", paginatedSearch.Search);

        public Task<User> CreateUser(User user)
            => PostWebAPI(baseAddress, user);
    }
}