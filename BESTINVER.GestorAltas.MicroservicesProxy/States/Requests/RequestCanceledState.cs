using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public class RequestCanceledState : StateRequestStatusEnum<RequestValidation>
    {
        public RequestCanceledState()
        {
            Value = RequestStatusEnum.Canceled;
        }

        public static implicit operator RequestCanceledState(int? value)
        {
            return value ?? new RequestCanceledState();
        }

        public override bool Handle(StoreStateContext<RequestValidation> context)
        {
            return !context.Data.IsCanceled();
        }
    }
}