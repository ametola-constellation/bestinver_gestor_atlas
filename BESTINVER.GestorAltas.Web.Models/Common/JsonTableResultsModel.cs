using Newtonsoft.Json;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class JsonTableResultsModel : JQueryDataTableParamBaseModel
    {
        [JsonProperty(PropertyName = "aaData")]
        public IEnumerable<string[]> AaData { get; set; }

        [JsonProperty(PropertyName = "iTotalRecords")]
        public int ITotalRecords { get; set; }

        [JsonProperty(PropertyName = "iTotalDisplayRecords")]
        public int ITotalDisplayRecords { get; set; }
    }
}