using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States
{
    public interface IMomento<T>
    {
        ConcurrentStack<T> UndoTracker { get; }
        ConcurrentStack<T> RedoTracker { get; }

        T Undo();

        T Redo();
    }

    public class StoreStateContext<T> : IMomento<StateRequestStatusEnum<T>>
    {
        public ConcurrentStack<StateRequestStatusEnum<T>> ChangeTracker { get; private set; } = new ConcurrentStack<StateRequestStatusEnum<T>>();

        public ConcurrentStack<StateRequestStatusEnum<T>> UndoTracker { get; private set; } = new ConcurrentStack<StateRequestStatusEnum<T>>();
        public ConcurrentStack<StateRequestStatusEnum<T>> RedoTracker { get; } = new ConcurrentStack<StateRequestStatusEnum<T>>();

        public virtual StoreStateContext<T> With(IEnumerable<StateRequestStatusEnum<T>> states, StateRequestStatusEnum<T> currnetState, T data)
        {
            Data = data;
            DesiredState = currnetState;
            ChangeTracker = new ConcurrentStack<StateRequestStatusEnum<T>>(states.Reverse());
            return this;
        }

        public T Data { get; set; }

        public StateRequestStatusEnum<T> DesiredState { get; set; }

        public virtual bool Next()
        {
            ChangeTracker.TryPeek(out StateRequestStatusEnum<T> currentState);
            var stateHasChanged = DesiredState.Handle(this);

            if (stateHasChanged)
            {
                ChangeTracker.Push(DesiredState);
                UndoTracker.Push(DesiredState);
                RedoTracker.Clear();
            }
            ChangeTracker.TryPeek(out StateRequestStatusEnum<T> desiredState);
            return stateHasChanged && desiredState != currentState;
        }

        public void Previous()
        {
            if (ChangeTracker.Count != 1)
            {
                ChangeTracker.TryPop(out StateRequestStatusEnum<T> currentState);
                ChangeTracker.TryPeek(out StateRequestStatusEnum<T> desiredState);

                RedoTracker.Clear();
                UndoTracker.Push(currentState);
                DesiredState = desiredState;
            }
        }

        public StateRequestStatusEnum<T> Undo()
        {
            if (!UndoTracker.IsEmpty)
            {
                UndoTracker.TryPop(out StateRequestStatusEnum<T> state);
                RedoTracker.Push(state);
                DesiredState = state;
            }

            return DesiredState;
        }

        public StateRequestStatusEnum<T> Redo()
        {
            if (!RedoTracker.IsEmpty)
            {
                RedoTracker.TryPop(out StateRequestStatusEnum<T> state);
                UndoTracker.Push(state);
                DesiredState = state;
            }
            return DesiredState;
        }
    }
}