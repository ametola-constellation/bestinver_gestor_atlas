using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BESTINVER.Wordpress.WS.Controllers
{
    /// <summary>
    /// Test api
    /// </summary>
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        private readonly ISignUpService signUpService;

        public ValuesController(ISignUpService signUpService)
        {
            this.signUpService = signUpService;
        }

        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }
    }
}