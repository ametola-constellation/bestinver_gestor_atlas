using BestInver.WebPrivada.Shared.Models.Microservices.Carteras;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface ICarteraService
    {
        Task<IEnumerable<CarteraPositionBySector>> GetCarterasTopPositions(int idCartera);
        Task<IEnumerable<CarteraPositionBySector>> GetCarterasTopPositions(int idCartera, string sector, int numberOfResults);
        Task<Dictionary<string, string>> GetSectoralDistribution(int idCartera);
        Task<Dictionary<string, string>> GetGeographicalDistribution(int idCartera);
        Task<DateTime?> GetDataToDate();
    }
}