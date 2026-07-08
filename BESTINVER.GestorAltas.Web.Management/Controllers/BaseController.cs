using BestInver.Core.Utils.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections.Generic;
using System.Linq;

namespace BESTINVER.GestorAltas.Web.Management.Controllers
{
    //[LogAction]
    public class LogActionController : Controller
    {
        internal void AddCustomError(string error)
        {
            TempData["error"] += $"{error}";
        }

        internal void AddCustomSuccess(string success)
        {
            TempData["success"] += $"{success}";
        }

        public List<object> GetPublicUrlDownloadDocument(List<object> privatesUrl, string aes256Key)
        {
            if (privatesUrl is null)
            {
                return null;
            }
            var result = new List<object>();
            foreach (var url in privatesUrl)
            {
                result.Add(GetPublicUrlDownloadDocument(url.ToString(), aes256Key));
            }
            return result;
        }

        public string GetPublicUrlDownloadDocument(string privateUrl, string aes256Key)
        {
            if (string.IsNullOrWhiteSpace(privateUrl))
            {
                return string.Empty;
            }

            var encryptedUrl = CryptAes256Helper.EncryptUrl(privateUrl, aes256Key);

            return string.Join("/",
                Url.Action("openfile", "shared"),
                encryptedUrl,
                privateUrl[(privateUrl.LastIndexOf("/") + 1)..]);
        }
    }

    [SetTimezone]
    public class TimezoneController : LogActionController
    {
        public int TimeZone { get; set; }
    }

    public class SetTimezoneAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            TimezoneController controller = (TimezoneController)context.Controller;

            int timezone = 0;

            var cookie = context.HttpContext.Request.Cookies.FirstOrDefault(c => c.Key == "TimezoneOffset").Value;

            int.TryParse(cookie, out timezone);

            controller.TimeZone = timezone;

            base.OnActionExecuting(context);
        }
    }
}