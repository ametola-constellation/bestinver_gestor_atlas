using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface ISendMailService
    {
        Task<bool> SendUnlockpbcalertMail(Guid requestId);

        Task<string> SendNextstepsMail(Guid requestId, string documentNumber);

        Task SendDniremainderMail(Guid requestId, string dni);

        Task<bool> SendCallMeBackMail(string phone, RequestChannel channel);
    }
}