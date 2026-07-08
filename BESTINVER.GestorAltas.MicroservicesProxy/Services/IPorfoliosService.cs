using BestInver.WebPrivada.Shared.Models.Microservices.Portfolios;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface IPorfoliosService
    {
        Task<IEnumerable<AccountCustomer>> GetAccountByCustomer(int customerId);
        Task<IEnumerable<AccountCustomer>> GetAccountById(int accountId);
    }
}
