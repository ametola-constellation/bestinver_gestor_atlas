using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public abstract class RequestFinalStates : StateRequestStatusEnum<RequestValidation>
    {
        private readonly List<StateRequestStatusEnum<RequestValidation>> finalStates;

        protected RequestFinalStates()
        {
            finalStates = new List<StateRequestStatusEnum<RequestValidation>>
            {
                new RequestCanceledState(),
                new RequestExpiredState(),
                new RequestAbandonedState(),
                new RequestLockedState()
            };
        }

        public override bool Handle(StoreStateContext<RequestValidation> context)
        {
            return finalStates.All(x =>
            {
                var canMove = x.Handle(context);
                if (!canMove && context.DesiredState != x)
                {
                    context.DesiredState = x;
                }
                return canMove;
            });
        }
    }
}