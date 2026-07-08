using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public class RequestPendinSignatureState : RequestFinalStates
    {
        public RequestPendinSignatureState()
        {
            Value = RequestStatusEnum.PendingSignature;
        }

        public override bool Handle(StoreStateContext<RequestValidation> context)
        {
            context.DesiredState = new RequestPendingDniState();
            return base.Handle(context);
        }
    }
}