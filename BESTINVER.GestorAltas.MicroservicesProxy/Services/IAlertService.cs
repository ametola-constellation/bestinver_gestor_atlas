using BestInver.WebPrivada.Shared.Models.Microservices.Alerts;
using BestInver.WebPrivada.Shared.Models.Middleware.MiddleOffice;
using BestInver.WebPrivada.Shared.Models.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface IAlertService
    {
        Task<PaginatedResult<Alert>> Search(RequestAlertMOSearch requestAlertMOSearch);

        Task<PaginatedResult<Alert>> Search(PaginatedSearch<RequestAlertMOSearch> paginatedSearch);

        Task<Alert> Update(Alert alert);

        Task<Alert> Create(Alert alert);
        
        Task<IEnumerable<AlertType>> GetAllAlertTypes();

        Task<IEnumerable<Alert>> Create(IEnumerable<Alert> alerts);
    }
}