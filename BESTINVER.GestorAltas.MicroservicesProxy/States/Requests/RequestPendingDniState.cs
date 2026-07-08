using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public class RequestPendingDniState : RequestFinalStates
    {
        public RequestPendingDniState()
        {
            Value = RequestStatusEnum.PendingDNI;
        }

        public override bool Handle(StoreStateContext<RequestValidation> context)
        {
            if (context.Data.IsPhysical())
            {
                if (context.Data.HasOnlineSignature())
                {
                    if (context.Data.HasAllDocumentsUploaded())
                    {
                        context.DesiredState = new RequestDniVerificationState();
                    }
                }
                else
                {
                    context.DesiredState = new RequestDniVerificationState();
                }
            }
            else
            {
                if (context.Data.HasMadeTheMoneyTransfer())
                {
                    context.DesiredState = new RequestPendingSendRdState();
                }
                else
                {
                    context.DesiredState = new RequestPendingMoneyState();
                }
            }
            return base.Handle(context);
        }
    }
}