using System.Collections.Generic;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public interface IRequestStoreStateContext<T>
        where T : RequestValidation
    {
        RequestStoreStateContext<T> With(IEnumerable<StateRequestStatusEnum<T>> states, StateRequestStatusEnum<T> currentState, T data);
    }
}