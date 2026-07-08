using BESTINVER.GestorAltas.Utilities.Models;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Utilities.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate next;
        private readonly TelemetryClient telemetryClient;

        public ExceptionMiddleware(RequestDelegate next, TelemetryClient telemetryClient)
        {
            this.next = next;
            this.telemetryClient = telemetryClient;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                var status = context.Response.StatusCode;

                var requestBodyStream = new MemoryStream();
                var originalRequestBody = context.Request.Body;

                await context.Request.Body.CopyToAsync(requestBodyStream);
                requestBodyStream.Seek(0, SeekOrigin.Begin);

                var url = UriHelper.GetDisplayUrl(context.Request);
                var requestBodytext = new StreamReader(requestBodyStream).ReadToEnd();

                requestBodyStream.Seek(0, SeekOrigin.Begin);
                context.Request.Body = requestBodyStream;

                await next(context);

                context.Request.Body = originalRequestBody;
                
            }
            catch (Exception ex)
            {
                telemetryClient.TrackException(ex);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            return context.Response.WriteAsync(new ErrorDetails()
            {
                StatusCode = context.Response.StatusCode,
                Message = exception.Message
            }.ToString());
        }
    }
}
