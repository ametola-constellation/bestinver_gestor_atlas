using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public class RequestPendingMoneyState : RequestFinalStates
    {
        public RequestPendingMoneyState()
        {
            Value = RequestStatusEnum.PendingMoney;
        }

        public override bool Handle(StoreStateContext<RequestValidation> context)
        {
            context.DesiredState = new RequestPendingSendRdState();
            return base.Handle(context);
        }
    }
}