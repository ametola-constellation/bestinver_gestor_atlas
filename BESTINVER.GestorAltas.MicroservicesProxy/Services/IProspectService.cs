using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public  interface IProspectService
    {
        Task UpdateConsentModal(ApplicantBasicData applicant);
    }
}
