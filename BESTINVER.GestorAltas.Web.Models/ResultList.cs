using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class ResultList<T>
    {
        public ResultList(List<T> list, long partialCount, long totalCount)
        {
            List = list;
            TotalCount = totalCount;
            PartialCount = partialCount;
        }

        public List<T> List { get; set; }
        public long PartialCount { get; set; }
        public long TotalCount { get; set; }
    }
}