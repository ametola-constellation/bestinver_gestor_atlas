using BestInver.WebPrivada.Shared.Models.Microservices.Customers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface ICustomersService
    {
        Task<Customer> GetCustomerBy(int id);
        Task<bool> CheckCustomerRD(string dni, int numdays);
        Task<ApplicantIds> GetCustomerByDNI(string dni);
        Task<List<UniqueMobile>> CheckUniqueMobile(UniqueMobileRequest model);
    }
}