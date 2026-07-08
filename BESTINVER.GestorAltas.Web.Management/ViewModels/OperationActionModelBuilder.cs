using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.Web.Management.Models.Operation;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Management.ViewModels
{
    public sealed class OperationActionModelBuilder
    {
        private List<Request> requests = new List<Request>();

        public OperationActionModelBuilder WithRequests(List<Request> requests)
        {
            this.requests = requests;
            return this;
        }

        public OperationInfoModel Build()
        {
            return new OperationInfoModel
            {
                Requests = this.requests
            };
        }
    }
}