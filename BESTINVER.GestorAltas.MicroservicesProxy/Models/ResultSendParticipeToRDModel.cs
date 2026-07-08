using System.Collections.Generic;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Models
{
    public class ResultSendParticipeToRDModel
    {
        public bool Result { get; set; }
        public string Message { get; set; }
        public string CuentaId { get; set; }

        public Dictionary<int, int> OperationsParOpe { get; set; }
    }
}