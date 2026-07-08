namespace BESTINVER.GestorAltas.Web.Management.Models.PeriodicsOperations
{
    using Newtonsoft.Json;
    using System.Collections.Generic;

    public class TableResultCreatePeriodicOperation
    {
        [JsonProperty("accountid")]
        public int AccountId { get; set; }
        [JsonProperty("owners")]
        public Dictionary<string, string> Owners { get; set; }
    }
}
