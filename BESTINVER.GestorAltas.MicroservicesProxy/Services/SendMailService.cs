using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class SendMailService : ISendMailService
    {
        private readonly IApiWebPrivadaHelper api;
        private const string sendmaildBaseAddress = "/api/sendmail";

        public SendMailService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public Task SendDniremainderMail(Guid requestId, string dni)
            => api.PostWebAPI<string>($"{sendmaildBaseAddress}/dniremainder/{requestId}/{dni}", "");

        public Task<string> SendNextstepsMail(Guid requestId, string documentNumber)
            => api.PostWebAPI($"{sendmaildBaseAddress}/nextsteps/{requestId}?documentNumber={documentNumber}", "");

        public Task<bool> SendUnlockpbcalertMail(Guid requestId)
            => api.PostWebAPI<bool>($"{sendmaildBaseAddress}/unlockpbcalert/{requestId}", true);

        public Task<bool> SendCallMeBackMail(string phone, RequestChannel channel)
            => api.PostWebAPI<bool,RequestChannel>($"{sendmaildBaseAddress}/sendCallMeBackMail/{phone}", channel);
    }
}