using BestInver.WebPrivada.Shared.Models.Microservices.AdviceProduct;
using System.Linq;

namespace BESTINVER.GestorAltas.Web.Management.Extensions
{
    public static class RequestAdviceProductSearchResponseExtensions
    {
        public static string GetStatus(this RequestAdviceProductSearchResponse m)
        {
            return m.Status.OrderByDescending(s => s.StartDate).Select(s => s.StatusType?.Name).FirstOrDefault()?.ToString();
        }

        public static string GetIdStatus(this RequestAdviceProductSearchResponse m)
        {
            return m.Status.OrderByDescending(s => s.StartDate).Select(s => s.StatusType?.Id).FirstOrDefault()?.ToString();
        }
    }
}
