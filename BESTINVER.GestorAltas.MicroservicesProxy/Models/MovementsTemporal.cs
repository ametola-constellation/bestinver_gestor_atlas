using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using System;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class MovementsTemporal
    {
        public int Id { get; set; }

        public DateTime OperationDate { get; set; }

        public DateTime ValuationDate { get; set; }
        public string Concept { get; set; }

        public string Amount { get; set; }

        public string UserName { get; set; }

        public string IdProduct { get; set; }

        public virtual IEnumerable<OperationMovementsTemporal> OperationMovement { get; set; }
        public int RowInExcel { get; set; }

    }

    public class MovementsListRequestTemporaly
    {
        public DateTime OperationDate { get; set; }
        public int? IdProducto { get; set; }
        public int? IdMovimiento { get; set; }
    }

    public class OperationMovementsTemporal
    {

        public int IdMovement { get; set; }
        public int IdOperation { get; set; }
        //public string Account{ get; set; }
        public int Weight { get; set; }
        public int LevelWeight { get; set; }
        public DateTime Date { get; set; }
        public string UserName { get; set; }
        public bool Selected { get; set; }
        public bool DefinitelyLinked { get; set; }
        public string UserNameLinked { get; set; }
        public DateTime? DateLinked { get; set; }
        public virtual RequestOperation Operation { get; set; }
        public string requestId { get; set; }
        public string OperationType { get; set; }
        public string Status { get; set; }
        public string Observations { get; set; }
        public string IdCuenta { get; set; }
        public string Titular { get; set; }
        public DateTime SignedDate { get; set; }
        public string Amount { get; set; }
        public int StatusId { get; set; }
        public bool LifeCycleChanged { get; set; }
        public bool LifeCicleOk { get; set; }
        public int IdRequestChannel { get; set; }
    }

    public class CheckMovementOperation
    {
        public int IdOperation { get; set; }
        public int IdMovement { get; set; }
        public string RetMsg { get; set; }
        public bool Result { get; set; }
    }

    public class SaveMovementsResponse
    {
        public string Err { get; set; }
        public bool Saved { get; set; }
        public List<int> ProductIds { get; set; }
    }
}