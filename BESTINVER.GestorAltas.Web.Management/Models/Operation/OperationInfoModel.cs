using BestInver.WebPrivada.Shared.Models.Microservices.Operations;
using System.Collections.Generic;
using System;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;

namespace BESTINVER.GestorAltas.Web.Management.Models.Operation
{
    public class OperationInfoModel
    {
        public OperationInfoModel()
        {
            RequestIds = new List<Guid>();
            Requests = new List<Request>();
        }

        public DateTime LiquidativeDate { get; set; }
        public List<Guid> RequestIds { get; set; }
        public List<Request> Requests { get; set; }
        public bool GenerateFile { get; set; }

        public string UserName { get; set; }
    }
}