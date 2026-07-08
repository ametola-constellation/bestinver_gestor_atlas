using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Shared;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface IDashboardService
    {
        Task<PaginatedResult<RequestDashboard>> Search(PaginatedSearch<RequestDashboardSearch> paginatedSearch);
    }
}