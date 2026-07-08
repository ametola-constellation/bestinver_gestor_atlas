using BestInver.WebPrivada.Shared.Models.Microservices.Aml;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface IAmlService
    {
        Task<bool> Cancel(Guid requestId);

        Task<AmlRequest> CheckForAmlAlerts(Guid id);
    }
}
