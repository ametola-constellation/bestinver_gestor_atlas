using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public class RequestPendingSendRdState : RequestFinalStates
    {
        public RequestPendingSendRdState()
        {
            Value = RequestStatusEnum.PendingSendRd;
        }

        public override bool Handle(StoreStateContext<RequestValidation> context)
        {
            context.DesiredState = new RequestRegisterState();
            return true;
        }
    }
}