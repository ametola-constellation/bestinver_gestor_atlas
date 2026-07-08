using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Shared;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IApiWebPrivadaHelper api;
        private const string dashboardBaseAddress = "/api/dashboards";

        public DashboardService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public async Task<PaginatedResult<RequestDashboard>> Search(PaginatedSearch<RequestDashboardSearch> paginatedSearch)
        {
            var result = await api.PostWebAPI<PaginatedResult<RequestDashboard>,
                RequestDashboardSearch>($"{dashboardBaseAddress}{paginatedSearch.GetQueryString(typeof(RequestDashboardSearch))}", paginatedSearch.Search).ConfigureAwait(false);
            return result;
        }
    }
}