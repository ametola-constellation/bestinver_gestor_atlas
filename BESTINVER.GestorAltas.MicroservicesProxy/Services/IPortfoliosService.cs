using BestInver.WebPrivada.Shared.Models.Microservices.Portfolios;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface IPortfoliosService
    {
        Task<List<AccountCustomer>> GetAccountData(int accountId);
        Task<IEnumerable<AccountCustomer>> GetAccountByCustomer(int customerId);
        Task<IEnumerable<AccountCustomer>> GetAccountById(int accountId);
        Task<IEnumerable<AccountProduct>> GetAccountProducts(int customerId, int accountId);
    }
}
