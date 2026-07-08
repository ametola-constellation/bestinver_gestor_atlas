using Azure.Monitor.OpenTelemetry.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Serilog;
using System;
using Microsoft.Extensions.DependencyInjection;
using BESTINVER.GestorAltas.Utilities.Extensions;

namespace BESTINVER.Wordpress.WS
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
            .UseSerilog((ctx, services, lc) =>
            {
                lc.WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level}] {SourceContext}{NewLine}{Message:lj}{NewLine}{Exception}{NewLine}")
                .Enrich.FromLogContext();
                try
                {
                    var monitorOptions = services.GetRequiredService<IOptionsMonitor<AzureMonitorOptions>>();
                    var azMonitorOptions = monitorOptions.CurrentValue;
                    var appInsightsConnectionString = Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING");
                    if (azMonitorOptions != null && !string.IsNullOrEmpty(azMonitorOptions.ConnectionString))
                    {
                        lc.WriteTo.ApplicationInsights(azMonitorOptions.ConnectionString, TelemetryConverter.Traces);
                    }
                    else if (!string.IsNullOrEmpty(appInsightsConnectionString))
                    {
                        lc.WriteTo.ApplicationInsights(appInsightsConnectionString, TelemetryConverter.Traces);
                    }
                    else
                    {
                        Log.Warning("Can not set Serilog WriteTo.ApplicationInsights");
                    }
                }
                catch
                {
                    Log.Warning("Can not set Serilog WriteTo.ApplicationInsights");
                }
                lc.ReadFrom.Configuration(ctx.Configuration);
            })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    string EnvironmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                    if (EnvironmentName != "Development")
                    {
                        webBuilder
                            .ConfigureAppConfigurationBst("AppConfig", "WordpressApi:Sentinel");
                    };
                    webBuilder
                    .UseStartup<Startup>();
                });
    }
}