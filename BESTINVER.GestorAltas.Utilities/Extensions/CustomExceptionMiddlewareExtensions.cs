using BESTINVER.GestorAltas.Utilities.Models;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;

namespace BESTINVER.GestorAltas.Utilities.Extensions
{
    public static class CustomExceptionMiddlewareExtensions
    {
        public static void ConfigureExceptionHandler(this IApplicationBuilder app, TelemetryClient client)
        {
            app.UseExceptionHandler(appError =>
            {
                appError.Run(async context =>
                {
                    var requestBodyStream = new MemoryStream();
                    var originalRequestBody = context.Request.Body;

                    await context.Request.Body.CopyToAsync(requestBodyStream);
                    requestBodyStream.Seek(0, SeekOrigin.Begin);

                    //var url = UriHelper.GetDisplayUrl(context.Request);
                    var requestBodytext = new StreamReader(requestBodyStream).ReadToEnd();

                    requestBodyStream.Seek(0, SeekOrigin.Begin);
                    context.Request.Body = requestBodyStream;

                    context.Request.Body = originalRequestBody;




                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "application/json";

                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                    if (contextFeature != null)
                    {
                        client.TrackException(contextFeature.Error);

                        await context.Response.WriteAsync(new ErrorDetails()
                        {
                            StatusCode = context.Response.StatusCode,
                            Message = "Internal Server Error."
                        }.ToString());
                    }
                });
            });
        }
    }
}
