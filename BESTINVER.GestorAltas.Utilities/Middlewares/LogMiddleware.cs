using BESTINVER.GestorAltas.Utilities.Middlewares;
using Microsoft.AspNetCore.Builder;
using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Utilities.MiddleWares
{
    public static class LogMiddleware
    {


        public static IApplicationBuilder UseLogMiddleware(this IApplicationBuilder builder)
        {
            builder.UseMiddleware<Log>();
            return builder;
        }

        public static IApplicationBuilder ConfigureCustomExceptionMiddleware(this IApplicationBuilder app)
        {
            app.UseMiddleware<ExceptionMiddleware>();
            return app;
        }

        public static IApplicationBuilder UseCustomUserMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<CustomUserMiddleware>();
        }
    }
}
