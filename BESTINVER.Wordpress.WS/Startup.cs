using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.Domain.Interfaces;
using BESTINVER.GestorAltas.MicroservicesProxy;
using BESTINVER.GestorAltas.MicroservicesProxy.Services.Configurations;
using BESTINVER.GestorAltas.Utilities.Extensions;
using BESTINVER.GestorAltas.Utilities.Logger;
using BESTINVER.GestorAltas.Web.Management.Common;
using BESTINVER.Wordpress.WS.Swagger;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Serilog;
using System;
using Microsoft.Extensions.Hosting;
using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using BestInver.Core.Otel.Extensions;
using NuGet.Configuration;
using BESTINVER.Wordpress.WS.HealthChecks;
using BestInver.Core.Cache.Extensions;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using BestInver.Core.Http.Extensions;
using BestInver.Core.Models.AppSettings;
using AppSettings = BESTINVER.GestorAltas.Domain.Configurations.AppSettings;
using System.Linq;

namespace BESTINVER.Wordpress.WS
{
    public class Startup
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration Configuration;

        public Startup(IConfiguration configuration, IWebHostEnvironment webHostingEnvironment)
        {
            Configuration = configuration;
            _env = webHostingEnvironment;
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;
            });

            services.Configure<ForwardedHeadersOptions>(Configuration.GetSection(nameof(ForwardedHeadersOptions)));
            services.Configure<AppSettings>(Configuration.GetSection(nameof(AppSettings)));


            var idpSection = Configuration.GetSection(nameof(IdentityServerSection));
            services.Configure<IIdentityServerSection>(idpSection);
            services.Configure<IdentityServerSection>(idpSection);
            var idpSettings = idpSection.Get<IdentityServerSection>();
            services.AddSingleton<IIdentityServerSection>(idpSettings);

            var appSettings = Configuration.GetSection(nameof(AppSettings));
            services.Configure<IAppSettings>(appSettings);
            services.Configure<AppSettings>(appSettings);
            var settings = appSettings.Get<AppSettings>();
            services.AddSingleton<IAppSettings>(settings);

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddHttpClient();

            services.AddScoped<IApiWebPrivadaHelper, ApiWebPrivadaHelper>();

            services.AddScoped<IRequestStateFactory, RequestStateFactory>();
            services.AddScoped(typeof(IRequestStoreStateContext<>), typeof(RequestStoreStateContext<>));

            Dependencies.GetServiceRegistrations().ForEach(x => services.AddScoped(x.Service, x.Implementation));

            services.AddEndpointsApiExplorer();
            SwaggerConfiguration.AddRegistration(services);

            services.AddAutoMapper(cfg => cfg.LicenseKey = settings.AutoMapper.LicenseKey,
                    typeof(Startup));

            services.ConfigureOtel(_env.EnvironmentName, settings.AzureMonitor);

            if (settings.Cache.Enable && string.IsNullOrEmpty(settings.Cache.ConnectionString))
            {
                throw new InvalidOperationException("Cache connection string is required");
            }
            services.AddStackExchangeRedisCache(settings.Cache);
            services.ConfigureHttpClients(
            new Oidc
            {
                Authority = idpSettings.Authority,
                ClientId = idpSettings.ClientId,
                ClientSecret = idpSettings.ClientSecret,
                Scope = idpSettings.Scopes.Split(" ").ToList()
            }, settings.Retry);

            var healthCheckBuilder = services.AddHealthChecks();
            healthCheckBuilder.AddRedis(settings.Cache.ConnectionString);
            healthCheckBuilder.AddCheck<StartupAndReadyHealthCheck>
            (
                "Startup",
                tags: new[] { "ready" }
            );


            services.AddMvc()
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                    //options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    //options.SerializerSettings.Culture = new System.Globalization.CultureInfo("es-ES");
                    options.SerializerSettings.ContractResolver = new DefaultContractResolver();
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                }
            );

            services.AddHsts(options =>
            {
                options.Preload = true;
                options.IncludeSubDomains = true;
                options.MaxAge = TimeSpan.FromDays(60);
            });

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.SetIsOriginAllowed(origin => true) // allow any origin
                                        .AllowAnyMethod()
                                        .AllowAnyHeader()
                                        .AllowCredentials());
            });

            services.TryAddSingleton(services);

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            var fordwardedHeaderOptions = new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost
            };
            fordwardedHeaderOptions.KnownNetworks.Clear();
            fordwardedHeaderOptions.KnownProxies.Clear();

            app.UseForwardedHeaders(fordwardedHeaderOptions);

            var pathBase = Configuration.GetValue<string>("PathBase");
            if (!string.IsNullOrEmpty(pathBase))
            {
                app.UsePathBase(pathBase);
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                SwaggerConfiguration.AddRegistration(app);
            }
            else
            {
                app.UseHsts();
            }

            app.UseStaticFiles();
            app.UseRouting();

            app.UseCors("CorsPolicy");

            app.UseHealthChecks("/health", new HealthCheckOptions
            {
                Predicate = _ => false
            });
            app.UseHealthChecks("/health/ready", new HealthCheckOptions
            {
                Predicate = healthCheck => healthCheck.Tags.Contains("ready")
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

    }
}