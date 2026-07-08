using BESTINVER.GestorAltas.Web.Public.Models;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace BESTINVER.GestorAltas.Web.Public.Controllers
{
    public class ErrorController : Controller
    {

        public ActionResult LogError(ErrorMessage error)
        {
            //var exceptionString = string.IsNullOrEmpty(error.Exception) ? "" : System.Uri.UnescapeDataString(error.Exception);

            //string url = error.Url != null ? $", Url: {error.Url}" : null;
            //string linenumber = error.LineNumber != null ? $", LineNumber: {error.LineNumber}" : null;

            //Log.Error($"Error in Browser: {error.Browser}-{error.RequestId}-{linenumber}{url} -> {exceptionString}");

            return Json(new { result = true });
        }

        public ActionResult LogDebug(DebugMessage debug)
        {
            //var debugString = string.IsNullOrEmpty(debug.Message) ? "" : System.Uri.UnescapeDataString(debug.Message);

            //string url = debug.Url != null ? $", Url: {debug.Url}" : null;

            //Log.Debug($"Debug Browser: {debug.Browser}-{debug.RequestId}-{url} -> {debugString}");

            return Json(new { result = true });
        }

        public ActionResult InternalError()
        {
            return View("Error");
        }

        public ActionResult NotFoundError()
        {
            return View("Error", (object)"404");
        }

        public ActionResult SessionExpiredError()
        {
            return View("Error", (object)"EXPIRED");
        }
    }
}