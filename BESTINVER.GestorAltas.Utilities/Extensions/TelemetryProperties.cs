using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using System.Net;

namespace BESTINVER.GestorAltas.Utilities.Extensions
{
    public class TelemetryProperties : ITelemetryInitializer
    {
        private readonly string _applicationName;

        public TelemetryProperties(string applicationName)
        {
            _applicationName = applicationName;
        }

        public void Initialize(ITelemetry telemetry)
        {
            //if (!telemetry.Context.Properties.Keys.Contains("ApplicationName"))
            //{
            //    telemetry.Context.Properties.Add("ApplicationName", _applicationName);
            //}

            if (!telemetry.Context.GlobalProperties.ContainsKey("ApplicationName"))
            {
                telemetry.Context.GlobalProperties["ApplicationName"] = _applicationName;
            }
        }
    }
}