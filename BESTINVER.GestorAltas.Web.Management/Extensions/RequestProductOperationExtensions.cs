using System.Collections.Generic;
using System.Linq;

namespace BestInver.WebPrivada.Shared.Models.Microservices.Requests
{
    public static class RequestProductOperationExtensions
    {
        public static IEnumerable<IGrouping<int, RequestProductOperation>> GetGroupedByProductType(this IEnumerable<RequestProductOperation> requestProductOperations)
            => requestProductOperations.GroupBy(p => p.Product.Id);
    }
}