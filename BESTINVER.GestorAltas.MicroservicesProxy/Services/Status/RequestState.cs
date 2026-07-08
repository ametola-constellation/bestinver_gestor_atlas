using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services.Status
{
    public abstract class RequestState
    {

        public RequestStatusEnum Value { get; protected set; }

        public static implicit operator RequestStatusEnum(RequestState value) => value?.Value ?? default(RequestStatusEnum);

        public static implicit operator int(RequestState value) => (int?)value?.Value ?? default(int);

        public abstract bool Handle(RequestStateContext context);

    }
}
