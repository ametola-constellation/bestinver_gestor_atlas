using BestInver.WebPrivada.Shared.Models.Microservices.Portfolios;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class PorfoliosService : IPorfoliosService
    {
        private readonly IApiWebPrivadaHelper api;
        private const string baseAddress = "/api/portfolios";

        public PorfoliosService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public Task<IEnumerable<AccountCustomer>> GetAccountByCustomer(int customerId)
            => api.GetWebAPI<IEnumerable<AccountCustomer>>($"{baseAddress}/customer/{customerId}/accounts");
        public Task<IEnumerable<AccountCustomer>> GetAccountById(int accountId)
            => api.GetWebAPI<IEnumerable<AccountCustomer>>($"{baseAddress}/account/{accountId}");
    }
}
