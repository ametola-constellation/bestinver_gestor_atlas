using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public class RequestRegisterState : RequestFinalStates
    {
        public RequestRegisterState()
        {
            Value = RequestStatusEnum.Register;
        }

        public override bool Handle(StoreStateContext<RequestValidation> context)
        {
            base.Handle(context);
            return false;
        }
    }
}