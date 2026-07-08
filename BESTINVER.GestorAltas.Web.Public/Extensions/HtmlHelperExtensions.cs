using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.Routing;
using System;

namespace BESTINVER.GestorAltas.Web.Public.Extensions
{
    public static class HtmlHelpers
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

#pragma warning disable RCS1175 // Unused this parameter.
#pragma warning disable RECS0154 // Parameter is never used

        public static IHtmlContent SelectOptionActive(this IHtmlHelper htmlHelper, Func<bool> condition)
#pragma warning restore RECS0154 // Parameter is never used
#pragma warning restore RCS1175 // Unused this parameter.
        {
            if (condition())
            {
                return new HtmlString("selected");
            }
            return new HtmlString(string.Empty);
        }

        public static string GetUrl(this IHtmlHelper htmlHelper, string Action, string Controller, object RouteValues)
        {
            UrlHelper Url = new UrlHelper(htmlHelper.ViewContext);
            return Url.Action(Action, Controller, RouteValues);
        }
    }
}