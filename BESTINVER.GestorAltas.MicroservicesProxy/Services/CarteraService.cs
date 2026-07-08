using System;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    using BestInver.WebPrivada.Shared.Models.Microservices.Carteras;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using static BestInver.WebPrivada.Shared.Models.Shared.Const.Api;
    public class CarteraService : ICarteraService
    {
        private readonly IApiWebPrivadaHelper api;
        public CarteraService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public Task<IEnumerable<CarteraPositionBySector>> GetCarterasTopPositions(int idCartera)
            => api.GetWebAPI<IEnumerable<CarteraPositionBySector>>($"{Routes.Carteras.ApiUrl}/{idCartera}/positions");
        public Task<IEnumerable<CarteraPositionBySector>> GetCarterasTopPositions(int idCartera, string sector, int numberOfResults)
             => api.GetWebAPI<IEnumerable<CarteraPositionBySector>>($"{Routes.Carteras.ApiUrl}/{idCartera}/{sector}/{numberOfResults}");
        public Task<Dictionary<string, string>> GetSectoralDistribution(int idCartera)
            => api.GetWebAPI<Dictionary<string, string>>($"{Routes.Carteras.ApiUrl}/{idCartera}/sectorDistribution");
        public Task<Dictionary<string, string>> GetGeographicalDistribution(int idCartera)
             => api.GetWebAPI<Dictionary<string, string>>($"{Routes.Carteras.ApiUrl}/{idCartera}/geographicalDistribution");

        public async Task<DateTime?> GetDataToDate()
        {
            string dateString = await api.GetWebAPI<string>($"{Routes.Carteras.ApiUrl}/date").ConfigureAwait(false);
            if (DateTime.TryParse(dateString, out DateTime dateResult))
            {
                 return dateResult;
            }
            return null;
        }
    }
}