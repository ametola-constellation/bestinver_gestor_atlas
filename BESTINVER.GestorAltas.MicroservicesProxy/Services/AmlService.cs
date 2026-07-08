using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using BestInver.WebPrivada.Shared.Models.Microservices.Aml;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class AmlService: IAmlService
    {

        private readonly IApiWebPrivadaHelper api;
        private const string almBaseAddress = "/api/aml";

        public AmlService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public async Task<bool> Cancel(Guid requestId)
        {
            bool result = true;
            try
            {
                await api.DeleteWebAPI<Int32>($"{almBaseAddress}/cancel/{requestId}");
                result = true;
                return result;
            }
            catch
            {
                result = false;
                return result;
            }
        }

        public Task<AmlRequest> CheckForAmlAlerts(Guid id)
             => api.PostWebAPI<AmlRequest>($"{almBaseAddress}/validate/{id}", null);

    }
}
