using Newtonsoft.Json;

namespace BESTINVER.GestorAltas.Web.Management.Models.AdviceProduct
{
    public class CreateAdviceProduct
    {
        [JsonProperty("dni")]
        public string DNI { get; set; }
    }
}
