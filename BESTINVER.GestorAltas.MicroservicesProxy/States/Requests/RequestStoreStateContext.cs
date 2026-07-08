using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public class RequestStoreStateContext<T> : StoreStateContext<T>, IRequestStoreStateContext<T>
        where T : RequestValidation
    {
        public async Task<IEnumerable<RequestStatus>> SaveChanges(IRequestService requestService, IEnumerable<RequestStatus> requestStatuses)
        {
            if (requestStatuses.Any())
            {
                var statues = Data.Status.ToList();
                var addedStatuses = await requestService.Add(requestStatuses).ConfigureAwait(false);
                statues.AddRange(addedStatuses);
                return statues;
            }
            return null;
        }

        public new RequestStoreStateContext<T> With(IEnumerable<StateRequestStatusEnum<T>> states, StateRequestStatusEnum<T> currentState, T data)
        {
            base.With(states, currentState, data);
            return this;
        }
    }
}