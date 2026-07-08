using Newtonsoft.Json;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class JQueryDataTableParamModel : JQueryDataTableParamBaseModel
    {
        [JsonProperty(PropertyName = "sSearch")]
        public virtual string SSearch { get; set; }

        [JsonProperty(PropertyName = "iDisplayLength")]
        public virtual int IDisplayLength { get; set; }

        [JsonProperty(PropertyName = "iDisplayStart")]
        public virtual int IDisplayStart { get; set; }

        [JsonProperty(PropertyName = "iColumns")]
        public virtual int IColumns { get; set; }

        [JsonProperty(PropertyName = "iSortCol_0")]
        public virtual int ISortCol_0 { get; set; }

        [JsonProperty(PropertyName = "sSortDir_0")]
        public virtual string SSortDir_0 { get; set; }

        [JsonProperty(PropertyName = "iSortingCols")]
        public virtual int ISortingCols { get; set; }

        [JsonProperty(PropertyName = "sColumns")]
        public virtual string SColumns { get; set; }
    }
}