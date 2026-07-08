using Newtonsoft.Json;

namespace BESTINVER.GestorAltas.Web.Management.Models.PeriodicsOperations
{
    public class PeriodicOperationRequest
    {
        [JsonProperty("idRequest")]
        public string IdRequest { get; set; }
    }
}
