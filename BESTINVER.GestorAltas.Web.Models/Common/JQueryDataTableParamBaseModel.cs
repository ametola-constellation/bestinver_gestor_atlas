using Newtonsoft.Json;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class JQueryDataTableParamBaseModel
    {
        [JsonProperty(PropertyName = "sEcho")]
        public virtual string SEcho { get; set; }
    }
}