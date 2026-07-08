using Microsoft.Extensions.Options;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using System;
using Azure.Monitor.OpenTelemetry.AspNetCore;
using BESTINVER.GestorAltas.Utilities.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using System.Reflection;



namespace BESTINVER.GestorAltas.Web.Public
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
                    catch (Exception ex)
                    {
                        Log.Error(ex, "Can not set Serilog WriteTo.ApplicationInsights");
                    }
                    lc.ReadFrom.Configuration(ctx.Configuration);
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    string EnvironmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                    if (EnvironmentName != "Development")
                    {
#if DEBUG
                        Log.Warning("Starting in debug mode");
                        webBuilder.ConfigureAppConfiguration(x => x.AddUserSecrets(Assembly.GetExecutingAssembly(), true));
                        webBuilder.ConfigureAppConfigurationBstDebug("AppConfig", "4e9d4e79-34de-4df4-91cf-85ee70c7195e", "WebPublic:Sentinel");
#else
                        Log.Warning("Starting in release mode");
                        webBuilder.ConfigureAppConfigurationBst("AppConfig", "WebPublic:Sentinel");
#endif


                    }
                    ;

                    webBuilder.UseStartup<Startup>();
                });
    }
}