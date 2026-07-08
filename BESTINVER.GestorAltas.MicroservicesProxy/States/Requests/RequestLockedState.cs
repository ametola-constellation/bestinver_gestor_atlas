using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public class RequestLockedState : StateRequestStatusEnum<RequestValidation>
    {
        public RequestLockedState()
        {
            Value = RequestStatusEnum.Locked;
        }

        public override bool Handle(StoreStateContext<RequestValidation> context)
        {
            return !context.Data.HasActivePBCOrTerrorAlert();
        }
    }
}