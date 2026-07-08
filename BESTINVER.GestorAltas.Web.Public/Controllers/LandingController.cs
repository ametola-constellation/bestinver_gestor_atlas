using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Public.Controllers
{
    public class LandingController : Controller
    {
        protected ILogger<LandingController> logger;


        public LandingController(
            ILogger<LandingController> logger
            )
        {
            this.logger = logger;
        }

        public virtual IActionResult Index()
        {
            try
            {
                return View("Index");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "LandingController, error: {Message}", ex.Message);
                return StatusCode((int)System.Net.HttpStatusCode.InternalServerError, ex.GetBaseException().Message);
            }
        }
    }

}
