using BESTINVER.GestorAltas.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Microsoft.AspNetCore.Mvc.Rendering
{
    public static class SelectItemListExtensions
    {
        public static List<SelectListItem> ToSelectListItem<TSource, TResult>(this IEnumerable<TSource> source, Func<TSource, TResult> value, Func<TSource, TResult> text)
        {
            source = source ?? new List<TSource>();
            return source.Select(x => new SelectListItem { Value = value(x)?.ToString(), Text = text(x)?.ToString() }).ToList();
        }

        public static List<SelectListItem> ToSelectListItem(this IEnumerable<SelectItemModel> model)
        {
            return ToSelectListItem(model, x => x.Id, x => x.Description);
        }
    }
}