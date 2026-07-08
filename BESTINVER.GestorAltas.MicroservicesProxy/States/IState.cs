using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States
{
    public abstract class StateRequestStatusEnum<T> : IState<T>
    {
        public RequestStatusEnum Value { get; protected set; }

        public static implicit operator RequestStatusEnum(StateRequestStatusEnum<T> value) => value?.Value ?? default(RequestStatusEnum);

        public static implicit operator int(StateRequestStatusEnum<T> value) => (int?)value?.Value ?? default(int);

        public abstract bool Handle(StoreStateContext<T> context);
    }

    public interface IState<T>
    {
        bool Handle(StoreStateContext<T> context);
    }
}