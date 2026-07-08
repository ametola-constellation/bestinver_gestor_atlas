using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services.Status
{
    class ProspectRequestState : RequestState
    {
        public ProspectRequestState()
        {
            Value = RequestStatusEnum.Prospect;
        }

        public override bool Handle(RequestStateContext context)
        {
            throw new NotImplementedException();
        }
    }
}
