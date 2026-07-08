using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Alerts;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BestInver.WebPrivada.Shared.Models.Middleware.MiddleOffice;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class AlertService : IAlertService
    {
        private readonly IApiWebPrivadaHelper api;
        private readonly IRequestService requestService;
        private readonly IMapper mapper;
        private const string alertBaseAddress = "/api/alerts";

        public AlertService(IApiWebPrivadaHelper apiWebPrivadaHelper, 
            IRequestService requestService, 
            IMapper mapper)
        {
            api = apiWebPrivadaHelper;
            this.requestService = requestService;
            this.mapper = mapper;
        }

        public Task<PaginatedResult<Alert>> Search(PaginatedSearch<RequestAlertMOSearch> paginatedSearch)
            => api.PostWebAPI<PaginatedResult<Alert>, RequestAlertMOSearch>($"{alertBaseAddress}/search{paginatedSearch.GetQueryString()}", paginatedSearch.Search);

        public Task<PaginatedResult<Alert>> Search(RequestAlertMOSearch requestAlertMOSearch)
            => api.PostWebAPI<PaginatedResult<Alert>, RequestAlertMOSearch>($"{alertBaseAddress}/search", requestAlertMOSearch);

        public Task<Alert> Update(Alert alert)
            => api.PutWebAPI(alertBaseAddress, alert);

        public async Task<Alert> Create(Alert alert)
        {
            var result = await api.PostWebAPI(alertBaseAddress, alert).ConfigureAwait(false);
            //await requestService.ChangeRequestStatus(result).ConfigureAwait(false);
            return result;
        }
        
        public Task<IEnumerable<AlertType>> GetAllAlertTypes()
            => api.GetWebAPI<IEnumerable<AlertType>>($"{alertBaseAddress}/types");

        public async Task<IEnumerable<Alert>> Create(IEnumerable<Alert> alerts)
        {
            var result = new List<Alert>();
            foreach(var alert in alerts)
            {
                var alertResult = await api.PostWebAPI(alertBaseAddress, alert).ConfigureAwait(false);
                result.Add(alertResult);
            }
            return result;
        }
    }
}