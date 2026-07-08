using BestInver.WebPrivada.Shared.Models.Microservices.Portfolios;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class PortfoliosService : IPortfoliosService
    {
        private const string portfoliosBaseAddress = "/api/portfolios";
        private readonly IApiWebPrivadaHelper api;

        public PortfoliosService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public Task<List<AccountCustomer>> GetAccountData(int accountId)
            => api.GetWebAPI<List<AccountCustomer>>($"{portfoliosBaseAddress}/account/{accountId}");
        public Task<IEnumerable<AccountCustomer>> GetAccountByCustomer(int customerId)
            => api.GetWebAPI<IEnumerable<AccountCustomer>>($"{portfoliosBaseAddress}/customer/{customerId}/accounts");
        public Task<IEnumerable<AccountCustomer>> GetAccountById(int accountId)
            => api.GetWebAPI<IEnumerable<AccountCustomer>>($"{portfoliosBaseAddress}/account/{accountId}");        
        public Task<IEnumerable<AccountProduct>> GetAccountProducts(int customerId, int accountId)
            => api.GetWebAPI<IEnumerable<AccountProduct>>($"{portfoliosBaseAddress}/customer/{customerId}/accounts/{accountId}/products");
    }
}
