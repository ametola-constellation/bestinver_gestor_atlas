using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public class RequestExpiredState : StateRequestStatusEnum<RequestValidation>
    {
        public RequestExpiredState()
        {
            Value = RequestStatusEnum.Expired;
        }

        public override bool Handle(StoreStateContext<RequestValidation> context)
        {
            return !context.Data.IsExpired();
        }
    }
}