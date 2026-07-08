using System;
using System.Collections.Generic;
using System.Linq;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class SelectItemModel<TId, TDescription>
    {
        public virtual TId Id { get; set; }
        public virtual TDescription Description { get; set; }

#pragma warning disable RCS1158 // Static member in generic type should use a type parameter.

        public static List<SelectItemModel> Build<T>()
#pragma warning restore RCS1158 // Static member in generic type should use a type parameter.
            where T : struct

        {
            return Enum.GetValues(typeof(T)).Cast<T>().Select(x => new SelectItemModel { Id = ((int)(object)x).ToString(), Description = x.ToString().Replace('_', ' ') }).ToList();
        }
    }

    public class SelectItemModel : SelectItemModel<string, string>
    {
    }
}