namespace BESTINVER.GestorAltas.MicroservicesProxy.States
{
    public interface IStateFactory<TContext, in TIn, TOut>
        where TContext : StoreStateContext<TOut>
    {
        TContext Create(TIn @object);
    }
}