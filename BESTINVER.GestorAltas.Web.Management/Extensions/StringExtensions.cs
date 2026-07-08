using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;

namespace BESTINVER.GestorAltas.Web.Management
{
    public static class StringExtensions
    {
        public static IHtmlContent RouteActive(this IHtmlHelper htmlHelper, string controllerName)
        {
            var controller = htmlHelper.ViewContext.RouteData.Values["controller"].ToString();
            if (controller == controllerName)
            {
                return new HtmlString("active");
            }
            return new HtmlString(string.Empty);
        }

#pragma warning disable RECS0154 // Parameter is never used
#pragma warning disable RCS1175 // Unused this parameter.

        public static IHtmlContent SelectOptionActive(this IHtmlHelper htmlHelper, Func<bool> condition)
#pragma warning restore RCS1175 // Unused this parameter.
#pragma warning restore RECS0154 // Parameter is never used
        {
            if (condition())
            {
                return new HtmlString("selected");
            }
            return new HtmlString(string.Empty);
        }
    }
}