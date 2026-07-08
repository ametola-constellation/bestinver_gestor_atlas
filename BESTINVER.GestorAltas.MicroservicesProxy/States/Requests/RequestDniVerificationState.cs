using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public class RequestDniVerificationState : RequestFinalStates
    {
        public RequestDniVerificationState()
        {
            Value = RequestStatusEnum.PendingDNIVerification;
        }

        public override bool Handle(StoreStateContext<RequestValidation> context)
        {
            var result = base.Handle(context);
            if (result)
            {
                context.DesiredState = new RequestPendingMoneyState();
            }
            return result;
        }
    }
}