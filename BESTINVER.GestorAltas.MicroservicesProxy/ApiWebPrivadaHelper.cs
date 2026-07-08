using BESTINVER.GestorAltas.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net.Http;

namespace BESTINVER.GestorAltas.MicroservicesProxy
{
    public class ApiWebPrivadaHelper : ApiHelperBase, IApiWebPrivadaHelper
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly ILogger<ApiWebPrivadaHelper> logger;

        public ApiWebPrivadaHelper(
            IAppSettings appSettings,
            IHttpContextAccessor httpContextAccessor,
            ILogger<ApiWebPrivadaHelper> logger,
            IHttpClientFactory httpClientFactory) : base(httpClientFactory, httpContextAccessor, appSettings.ApiWebPrivadaBaseAddress)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.logger = logger;
        }
    }
}