using BestInver.WebPrivada.Shared.Models.Microservices.Operations;
using System.Collections.Generic;
using System;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;

namespace BESTINVER.GestorAltas.Web.Management.Models.Movements
{
    public class MovementsInfoModel
    {
        public MovementsInfoModel()
        {
            RequestIdsNew = new List<Guid>();
            RequestIdsExists = new List<Guid>();
            Requests = new List<Request>();
        }

        public DateTime LiquidativeDate { get; set; }
        public List<Guid> RequestIdsNew { get; set; }
        public List<Guid> RequestIdsExists { get; set; }
        public List<Request> Requests { get; set; }
        public bool GenerateFile { get; set; }
        public string UserName { get; set; }
        public DateTime Date { get; set; }
        public int ProductId { get; set; }
        public int CountMovements { get; set; }
    }
}