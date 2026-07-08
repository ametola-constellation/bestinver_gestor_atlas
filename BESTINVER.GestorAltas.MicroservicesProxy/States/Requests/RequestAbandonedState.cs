using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public class RequestAbandonedState : StateRequestStatusEnum<RequestValidation>
    {
        public RequestAbandonedState()
        {
            Value = RequestStatusEnum.Abandoned;
        }

        public override bool Handle(StoreStateContext<RequestValidation> context)
        {
            return !context.Data.IsAbandoned();
        }
    }
}