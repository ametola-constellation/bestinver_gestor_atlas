using System.Linq;

namespace BESTINVER.GestorAltas.Web.Management.Models.Dashboard
{
    public class PostalTableResultModel : TableResultModel
    {
        public override string[] ToTable()
        {
            var list = base.ToTable().ToList();
            list.Add(Product);
            return list.ToArray();
        }
    }
}