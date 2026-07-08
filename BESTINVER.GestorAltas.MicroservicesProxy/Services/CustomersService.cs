using BestInver.WebPrivada.Shared.Models.Microservices.Customers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class CustomersService : ICustomersService
    {
        private readonly IApiWebPrivadaHelper api;
        private const string baseAddress = "/api/customers";

        public CustomersService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public Task<Customer> GetCustomerBy(int id)
            => api.GetWebAPI<Customer>($"{baseAddress}/{id}");

        public Task<bool> CheckCustomerRD(string dni, int numdays)
            => api.GetWebAPI<bool>($"{baseAddress}/{dni}/check/{numdays}");

        public Task<ApplicantIds> GetCustomerByDNI(string dni)
            => api.GetWebAPI<ApplicantIds>($"{baseAddress}/{dni}/ids");

        public Task<List<UniqueMobile>> CheckUniqueMobile(UniqueMobileRequest model)
            => api.PostWebAPI<List<UniqueMobile>, UniqueMobileRequest>($"{baseAddress}/checkUniqueMobile", model);
    }
}