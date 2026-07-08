using BESTINVER.GestorAltas.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Utilities.Middlewares
{
    public class CustomUserMiddleware
    {
        private readonly RequestDelegate _next;

        public CustomUserMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        // IMyScopedService is injected into Invoke
        public async Task Invoke(HttpContext httpContext, IRemediacionUser remediacionUser)
        {
            var user = httpContext.User.Identity.Name;
            remediacionUser.SetUser(user);
            await _next(httpContext);
        }
    }
}
