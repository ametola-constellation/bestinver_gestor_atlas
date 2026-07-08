using BESTINVER.GestorAltas.Utilities.Enums;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class BaseSearchQuery
    {
        public virtual string OrderBy { get; set; }
        public virtual OrderDir OrderDir { get; set; }
        public virtual int Limit { get; set; }
        public virtual int Offset { get; set; }
    }
}