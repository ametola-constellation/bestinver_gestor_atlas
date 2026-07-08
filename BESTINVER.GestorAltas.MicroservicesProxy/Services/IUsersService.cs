using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Users;
using BestInver.WebPrivada.Shared.Models.Shared;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface IUsersService
    {
        Task<PaginatedResult<User>> Search(PaginatedSearch<UserSearch> userSearch);

        Task Unlock(int userId, RequestChannelType requestChannelType);

        Task ResetPassword(int userId, ResetPassword resetPassword);

        Task<PaginatedResult<UserHistory>> OperationHistory(PaginatedSearch<UserHistory> paginatedSearch);

        Task<User> CreateUser(User user);
    }
}