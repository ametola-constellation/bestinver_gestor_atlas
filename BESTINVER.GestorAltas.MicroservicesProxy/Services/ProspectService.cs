using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class ProspectService : IProspectService
    {
        private readonly IApiWebPrivadaHelper api;
        private const string baseAddress = "/api/prospects";

        public ProspectService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public Task UpdateConsentModal(ApplicantBasicData applicant)
            => api.PutWebAPI($"{baseAddress}/updateconsentmodal", applicant);
    }
}
