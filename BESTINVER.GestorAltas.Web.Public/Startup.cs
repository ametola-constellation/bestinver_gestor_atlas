using Azure.Core;
using Azure.Identity;
using BestInver.Core.Cache.Extensions;
using BestInver.Core.Http.Extensions;
using BestInver.Core.Models.AppSettings;
using BestInver.Core.Otel.Extensions;
using BestInver.Core.Otel.Metrics;
using BestInver.WebPrivada.Shared.Models.Infraestructure.Configuration;
using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.Domain.Interfaces;
using BESTINVER.GestorAltas.MicroservicesProxy;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.MicroservicesProxy.Services.Configurations;
using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using BESTINVER.GestorAltas.Web.Common.Extensions;
using BESTINVER.GestorAltas.Web.Public.Telemetry;
using BESTINVER.GestorAltas.Web.Management.Common;
using BESTINVER.GestorAltas.Web.Public.HealthChecks;
using BESTINVER.GestorAltas.Web.Public.Middlewares;
using BESTINVER.GestorAltas.Web.Public.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using Microsoft.FeatureManagement;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace BESTINVER.GestorAltas.Web.Public
{
    public class Startup
    {
        private const string corsPolicyName = "CorsPolicy";

        public Startup(IConfiguration configuration, IWebHostEnvironment webHostingEnvironment)
        {
            Configuration = configuration;
            Env = webHostingEnvironment;
        }

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Env { get; }

        //This method gets called by the runtime.Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;
            });

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => false;
                options.MinimumSameSitePolicy = SameSiteMode.None;
                options.HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.Always;
                options.Secure = CookieSecurePolicy.Always;
            });

            services.Configure<FormOptions>(options =>
            {
                options.ValueLengthLimit = int.MaxValue;
                options.MultipartBodyLengthLimit = int.MaxValue;
                options.MultipartHeadersLengthLimit = int.MaxValue;
            });

            var identityServerSection = Configuration.GetSection(nameof(IdentityServerSection));
            services.Configure<IdentityServerSection>(identityServerSection);
            services.Configure<IIdentityServerSection>(identityServerSection);
            var idpSettings = identityServerSection.Get<IdentityServerSection>();
            services.AddSingleton<IIdentityServerSection>(idpSettings);

            services.Configure<ICustomError>(Configuration.GetSection(nameof(CustomErrors)));
            services.Configure<CustomErrors>(Configuration.GetSection(nameof(CustomErrors)));
            services.AddSingleton<ICustomError>(Configuration.GetSection(nameof(CustomErrors)).Get<CustomErrors>());

            var appSettings = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettings);
            var settings = appSettings.Get<AppSettings>();
            services.AddSingleton<IAppSettings>(settings);

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddCors(options =>
            {
                options.AddPolicy(corsPolicyName,
                    builder => builder.SetIsOriginAllowed(origin => true) // allow any origin
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });

            services.AddScoped<IApiWebPrivadaHelper, ApiWebPrivadaHelper>();
            services.AddScoped(typeof(IRequestStoreStateContext<>), typeof(RequestStoreStateContext<>));
            services.AddScoped<IRequestStateFactory, RequestStateFactory>();
            services.AddScoped<ICallLimitingService, CallLimitingService>();

            //Se inyecta el servicio de registro de servicios

            Dependencies.GetServiceRegistrations().ForEach(x =>
            {
                if (x.Service == typeof(IRegisterService))
                {
                    services.AddScoped<IRegisterService, RegisterService>();
                }
                else
                {
                    services.AddScoped(x.Service, x.Implementation);
                }
            });

            services.AddLocalization(o => o.ResourcesPath = "Resources");
            services.AddAutoMapper(cfg => cfg.LicenseKey = settings.AutoMapper.LicenseKey,
                    typeof(Startup).Assembly, typeof(MicroservicesProxy.Profiles.OperationProfile).Assembly, typeof(MicroservicesProxy.Profiles.RegisterProfile).Assembly);

            services.AddLogging();

            services.AddHsts(options =>
            {
                options.Preload = true;
                options.IncludeSubDomains = true;
                options.MaxAge = TimeSpan.FromDays(60);
            });


            if (!Env.IsDevelopment())
            {
                var dataProtectionConfiguration = Configuration.GetSection("DataProtection").Get<DataProtectionConfiguration>();
                var azCredential = GetAzCredential();
                const string APPLICATION_NAME = "Bestinver.Altas.App";
                services.AddDataProtection()
                    .PersistKeysToAzureBlobStorage(new Uri($"{dataProtectionConfiguration.AzureBlobStorageEndpoint}{dataProtectionConfiguration.AzureBlobStoragePath}"), azCredential)
                    .ProtectKeysWithAzureKeyVault(new Uri($"{dataProtectionConfiguration.AzureKeyVaultConfiguration.AzureKeyVaultEndpoint}{dataProtectionConfiguration.AzureKeyVaultKeyPath}"), azCredential)
                    .SetApplicationName(APPLICATION_NAME);
            }

            //Se inyecta solo para la parte cliente JS, mirar si existe correspondencia en OTEL            
            services.AddApplicationInsightsTelemetry();
            
            // Agregar procesador de telemetría para filtrar health checks
            services.AddApplicationInsightsTelemetryProcessor<HealthCheckTelemetryFilter>();
            //***************************************************************************

            services.ConfigureOtel(Env.ApplicationName, settings.AzureMonitor, [BestInverBusinessMetrics.ServiceName]);

            if (settings.Cache.Enable && string.IsNullOrEmpty(settings.Cache.ConnectionString))
            {
                throw new InvalidOperationException("Cache connection string is required");
            }
            var redisConn = services.AddStackExchangeRedisCache(settings.Cache);

            var healthCheckBuilder = services.AddHealthChecks();
            healthCheckBuilder.AddRedis(redisConn);
            healthCheckBuilder.AddCheck<StartupAndReadyHealthCheck>
            (
                "Startup",
                tags: new[] { "ready" }
            );

            services.AddCommonServices(Configuration);

            // Solo registrar servicios de Azure App Configuration si no es Development
            if (!Env.IsDevelopment())
            {
                services.AddAzureAppConfiguration();
            }

            services.AddFeatureManagement();

            services.AddMvc().AddNewtonsoftJson(o =>
            {
                o.SerializerSettings.Culture = new System.Globalization.CultureInfo("es-ES");
                o.SerializerSettings.ContractResolver = new DefaultContractResolver();
            });

            services.AddAntiforgery(options =>
            {
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            });

            services.ConfigureHttpClients(
               new Oidc
               {
                   Authority = idpSettings.Authority,
                   ClientId = idpSettings.ClientId,
                   ClientSecret = idpSettings.ClientSecret,
                   Scope = idpSettings.Scopes.Split(" ").ToList()
               }, settings.Retry);

            services.TryAddSingleton(services);
        }

        private static ChainedTokenCredential GetAzCredential()
        {
            List<TokenCredential> tokenCredentials = [];
#if DEBUG            
            tokenCredentials.Add(new DefaultAzureCredential());
#else
        var userManagedIdentityClientId = Environment.GetEnvironmentVariable("USER_IDENTITY_ID");
        tokenCredentials.Add(new ManagedIdentityCredential(userManagedIdentityClientId));
#endif
            return new ChainedTokenCredential([.. tokenCredentials]);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            // Solo usar el middleware si Azure App Configuration está configurado
            if (!env.IsDevelopment())
            {
                app.UseAzureAppConfiguration();
            }
            
            app.UseMiddleware<MaintenanceModeMiddleware>();

            var logger = loggerFactory.CreateLogger<Startup>();

            var fordwardedHeaderOptions = new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost
            };
            fordwardedHeaderOptions.KnownNetworks.Clear();
            fordwardedHeaderOptions.KnownProxies.Clear();

            app.UseForwardedHeaders(fordwardedHeaderOptions);

            var remediacionEnabled = app.ApplicationServices.GetService<IOptions<AppSettings>>().Value.RemediacionEnabled;

            string XOriginalHost = "X-ORIGINAL-HOST";
            app.Use((context, next) =>
            {
                if (context.Request.Headers.TryGetValue(XOriginalHost, out StringValues originalHostName))
                {
                    context.Request.Host = new HostString(originalHostName);
                }

                return next();
            });

            var pathBase = Configuration.GetValue<string>("PathBase");
            logger.LogDebug("PathBase: {PathBase}", pathBase);
            if (!string.IsNullOrEmpty(pathBase))
            {
                app.UsePathBase(pathBase);
            }

            System.Web.HttpContext.Configure(app.ApplicationServices.GetRequiredService<IHttpContextAccessor>());

            if (Env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseCors(corsPolicyName);
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            var cultures = new[] { new CultureInfo("es-ES") };

            app.UseRequestLocalization(new RequestLocalizationOptions()
            {
                DefaultRequestCulture = new Microsoft.AspNetCore.Localization.RequestCulture("es-ES"),
                SupportedCultures = cultures,
                SupportedUICultures = cultures
            });

            app.UseStaticFiles();
            app.UseRouting();

            app.UseCookiePolicy();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseHealthChecks("/health", new HealthCheckOptions
            {
                Predicate = _ => false
            });
            app.UseHealthChecks("/health/ready", new HealthCheckOptions
            {
                Predicate = healthCheck => healthCheck.Tags.Contains("ready")
            });

            app.UseEndpoints(routes =>
            {
                if (remediacionEnabled)
                {
                    routes.MapControllerRoute(
                        name: "remediacion",
                        pattern: "",
                        defaults: new { controller = "remediacion", action = "index" }
                    );
                    routes.MapControllerRoute(
                        name: "remediacionmaster",
                        pattern: "remediacion/{action}/{id?}",
                        defaults: new { controller = "remediacion", action = "index" }
                    );
                    routes.MapControllerRoute(
                        name: "error",
                        pattern: "error/{action}/{id?}",
                        defaults: new { controller = "error", action = "logerror" }
                    );
                    routes.MapControllerRoute(
                        name: "master",
                        pattern: "master/{action}/{id?}",
                        defaults: new { controller = "master" }
                    );
                    routes.MapControllerRoute(
                        name: "Shared",
                        pattern: "shared/{action}/{id?}",
                        defaults: new { controller = "Shared", action = "index" }
                    );
                    routes.MapControllerRoute(
                        name: "Default",
                        pattern: "{controller}/{action}/{id?}",
                        defaults: new { controller = "Home", action = "index" }
                    );
                }
                else
                {
                    routes.MapControllerRoute(
                        name: "juridica",
                        pattern: "juridica/{action}/{id?}",
                        defaults: new { controller = "juridica", action = "index" }
                    );
                    routes.MapControllerRoute(
                        name: "fisica",
                        pattern: "fisica/{action}/{id?}",
                        defaults: new { controller = "register", action = "index" }
                    );
                    routes.MapControllerRoute(
                        name: "extranjero",
                        pattern: "extranjero/{action}/{id?}",
                        defaults: new { controller = "extranjero", action = "index" }
                    );
                    routes.MapControllerRoute(
                        name: "landing",
                        pattern: "landing/{action}/{id?}",
                        defaults: new { controller = "landing", action = "index" }
                    );
                    routes.MapControllerRoute(
                        name: "empty",
                        pattern: "{id?}",
                        defaults: new { controller = "Home", action = "index" }
                    );
                    routes.MapControllerRoute(
                        name: "signatureIssuer",
                        pattern: "signatureIssuer/{idSignature}/status",
                        defaults: new { controller = "SignatureIssuer", action = "index" }
                    );
                    routes.MapControllerRoute(
                        name: "Default",
                        pattern: "{controller}/{action}/{id?}",
                        defaults: new { controller = "Home", action = "index" }
                    );
                }

            });
        }
    }
}