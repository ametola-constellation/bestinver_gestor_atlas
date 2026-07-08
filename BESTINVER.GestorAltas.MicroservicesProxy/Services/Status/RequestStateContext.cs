using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services.Status
{
    public class RequestStateContext
    {
        private Request request;
        private RequestState currentState;
        private IEnumerable<RequestStatus> statusToSave;

        public RequestStateContext(Request request)
        {
            this.request = request;
            var states = new Stack<RequestState>();
            var assemblyTypes = typeof(RequestState).Assembly.GetTypes();
            var types = assemblyTypes.Where(x => typeof(RequestState).IsAssignableFrom(x) && !x.IsInterface && !x.IsAbstract).Select(x => x.UnderlyingSystemType).ToList();
            var instances = types.Select(Activator.CreateInstance);
            var dynamicList = instances.ToList<dynamic>();
            request.Status.OrderBy(x => x.StartDate).ThenBy(x => x.Id).ToList().ForEach(x => states.Push(dynamicList.Single(i => i == x.StatusType.Id)));
            currentState = states.Peek();
            statusToSave = new List<RequestStatus>();
        }

    }
}
