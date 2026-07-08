using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Models.Movements
{
    public class OperationMovementsTemporal
    {
        [Required]
        public int IdMovement { get; set; }

        [Required]
        public int IdOperation { get; set; }

        [Required]
        public int Weight { get; set; }

        [Required]
        public int LevelWeight { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
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
        public DateTime? SignedDate { get; set; }
        public string Amount { get; set; }
        public int StatusId { get; set; }
        public bool LifeCycleChanged { get; set; }
        public bool LifeCicleOk { get; set; }
        public int IdRequestChannel { get; set; }





        //public Guid RequestId { get; set; }
        //public int Account  = 12345;

    }
}
