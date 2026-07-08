using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Utilities.MiddleWares
{
    public class Log
    {
        private readonly RequestDelegate next;
        private readonly TelemetryClient telemetryClient;

        public Log(RequestDelegate next, TelemetryClient telemetryClient)
        {
            this.next = next;
            this.telemetryClient = telemetryClient;
        }

        public async Task Invoke(HttpContext context)
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

            TraceRequest(requestBodytext, url, context.Request.Method);
        }

        private void TraceRequest(string payload, string url, string method)
        {
            var telemetry = new TraceTelemetry(url);

            telemetry.Properties.Add("Body", payload);
            telemetry.Properties.Add("Method", method);
            telemetryClient.TrackTrace(telemetry);
        }
    }
}
