using Autofac;
using Autofac.Extensions.DependencyInjection;
using Azure.Monitor.OpenTelemetry.AspNetCore;
using BESTINVER.GestorAltas.Utilities.Extensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Serilog;
using System;

namespace BESTINVER.GestorAltas.Web.Management
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseServiceProviderFactory(new AutofacServiceProviderFactory()) // Utiliza Autofac como el contenedor de inyección de dependencias
                .ConfigureContainer<ContainerBuilder>((context, builder) =>
                {
                    builder.RegisterModule<ServiceModules>();
                })
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
                        Log.Warning(ex, "Can not set Serilog WriteTo.ApplicationInsights");
                    }
                    lc.ReadFrom.Configuration(ctx.Configuration);
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    string EnvironmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

                    if (EnvironmentName != "Development")
                    {
                        webBuilder
                           .ConfigureAppConfigurationBst("AppConfig", "Management:Sentinel");
                    }

                    webBuilder
                    .UseStartup<Startup>();
                });
    }
}