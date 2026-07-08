using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public class RequestProspectState : RequestFinalStates
    {
        public RequestProspectState()
        {
            Value = RequestStatusEnum.Prospect;
        }

        public override bool Handle(StoreStateContext<RequestValidation> context)
        {
            var canMoveNext = base.Handle(context);
            if (canMoveNext)
            {
                context.DesiredState = new RequestPendinSignatureState();
            }
            return true;
        }
    }
}