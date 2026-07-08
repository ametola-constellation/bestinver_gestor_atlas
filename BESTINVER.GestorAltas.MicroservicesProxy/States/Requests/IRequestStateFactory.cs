using BestInver.WebPrivada.Shared.Models.Microservices.Requests;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public interface IRequestStateFactory : IStateFactory<RequestStoreStateContext<RequestValidation>, Request, RequestValidation>
    {
        RequestStoreStateContext<RequestValidation> Create<T>(Request @object) where T : RequestValidation;
    }
}