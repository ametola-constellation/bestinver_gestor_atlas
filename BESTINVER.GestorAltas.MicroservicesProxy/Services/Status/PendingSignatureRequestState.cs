using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services.Status
{
    class PendingSignatureRequestState : RequestState
    {
        public PendingSignatureRequestState()
        {
            Value = RequestStatusEnum.PendingSignature;
        }

        public override bool Handle(RequestStateContext context)
        {
            throw new NotImplementedException();
        }
    }
}
