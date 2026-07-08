using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Public.Models
{

    public class ErrorMessage
    {
        public string Browser { get; set; }
        public string Exception { get; set; }
        public string Url { get; set; }
        public string LineNumber { get; set; }
        public string RequestId { get; set; }
    }
    public class DebugMessage
    {
        public string Browser { get; set; }
        public string Message { get; set; }
        public string Url { get; set; }
        public string LineNumber { get; set; }
        public string RequestId { get; set; }
    }
}
