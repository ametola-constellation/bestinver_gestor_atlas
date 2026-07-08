using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public class RequestStateFactory : IRequestStateFactory
    {
        private readonly IMapper mapper;
        private readonly IRequestStoreStateContext<RequestValidation> requestStoreStateContext;

        public RequestStateFactory(IMapper mapper, IRequestStoreStateContext<RequestValidation> requestStoreStateContext)
        {
            this.mapper = mapper;
            this.requestStoreStateContext = requestStoreStateContext;
        }

        public RequestStoreStateContext<RequestValidation> Create(Request @object)
        {
            return Create<RequestValidation>(@object);
        }

        public RequestStoreStateContext<RequestValidation> Create<T>(Request @object)
            where T : RequestValidation
        {
            var request = mapper.Map<T>(@object);
            var states = new Stack<StateRequestStatusEnum<RequestValidation>>();
            var assemblyTypes = typeof(StateRequestStatusEnum<RequestValidation>).Assembly.GetTypes();
            var types = assemblyTypes.Where(x => typeof(StateRequestStatusEnum<RequestValidation>).IsAssignableFrom(x) && !x.IsInterface && !x.IsAbstract).Select(x => x.UnderlyingSystemType).ToList();

            var instances = types.Select(Activator.CreateInstance);
            var dynamicList = instances.ToList<dynamic>();

            request.Status.OrderBy(x => x.StartDate).ThenBy(x => x.Id).ToList().ForEach(x => states.Push(dynamicList.Single(i => i == x.StatusType.Id)));

            return requestStoreStateContext.With(states, states.Count > 0 ? states.Peek() : null, request);
        }
    }
}