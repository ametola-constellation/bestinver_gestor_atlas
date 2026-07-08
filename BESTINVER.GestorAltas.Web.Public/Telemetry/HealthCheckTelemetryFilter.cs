using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using System;
using System.Linq;

namespace BESTINVER.GestorAltas.Web.Public.Telemetry
{
    public class HealthCheckTelemetryFilter : ITelemetryProcessor
    {
        private static readonly string[] HealthPaths =
        [
            "/health",
            "/healthz",
            "/alive",
            "/health/ready",
            "/health/live",
            "/api/health",
            "/api/healthz",
            "/api/alive",
            "/api/health/ready",
            "/api/health/live"
        ];

        private ITelemetryProcessor Next { get; set; }

        public HealthCheckTelemetryFilter(ITelemetryProcessor next)
        {
            Next = next;
        }

        public void Process(ITelemetry item)
        {
            if (item is RequestTelemetry request)
            {
                var path = request.Url?.AbsolutePath;
                if (path != null && HealthPaths.Any(hp => 
                    path.Equals(hp, StringComparison.OrdinalIgnoreCase) || 
                    path.StartsWith(hp + "/", StringComparison.OrdinalIgnoreCase)))
                {
                    return;
                }
            }

            if (item is DependencyTelemetry dependency)
            {
                var target = dependency.Target;
                var data = dependency.Data;
                
                if ((target != null && HealthPaths.Any(hp => target.Contains(hp, StringComparison.OrdinalIgnoreCase))) ||
                    (data != null && HealthPaths.Any(hp => data.Contains(hp, StringComparison.OrdinalIgnoreCase))))
                {
                    return;
                }
            }

            Next.Process(item);
        }
    }
}
