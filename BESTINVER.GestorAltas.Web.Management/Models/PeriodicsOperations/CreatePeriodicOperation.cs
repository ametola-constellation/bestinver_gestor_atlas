using Newtonsoft.Json;

namespace BESTINVER.GestorAltas.Web.Management.Models.PeriodicsOperations
{
    public class CreatePeriodicOperation
    {
        [JsonProperty("dni")]
        public string DNI { get; set; }
    }
}
