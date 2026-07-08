
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Models
{
    public class ChangeRequestStatusModelResponse
    {
        public IEnumerable<RequestStatus> StatusList { get; set; }
        public bool ShowPendingSignaturePopUp { get; set; }
    }
}