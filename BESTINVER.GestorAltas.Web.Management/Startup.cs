using Autofac.Extensions.DependencyInjection;
using Azure.Core;
using Azure.Identity;
using BestInver.Core.Cache.Extensions;
using BestInver.Core.Http.Extensions;
using BestInver.Core.Models.AppSettings;
using BestInver.Core.Otel.Extensions;
using BestInver.WebPrivada.Shared.Models.Infraestructure.Configuration;
using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.Domain.Interfaces;
using BESTINVER.GestorAltas.MicroservicesProxy;
using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using BESTINVER.GestorAltas.Resource.Localization;
using BESTINVER.GestorAltas.Web.Common.Extensions;
using BESTINVER.GestorAltas.Web.Management.Common;
using BESTINVER.GestorAltas.Web.Management.HealthChecks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using TelemetryConfiguration = Microsoft.ApplicationInsights.Extensibility.TelemetryConfiguration;

namespace BESTINVER.GestorAltas.Web.Management
{
    public class Startup
    {
        private const string corsPolicyName = "CorsPolicy";

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Env = env;
        }

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Env { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAutofac();
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

            services.AddTransient<IValidationMetadataProvider, ValidationMetadataProvider<Strings>>();
            services.AddHttpContextAccessor();

            services.AddCors(options =>
            {
                options.AddPolicy(corsPolicyName,
                    builder => builder.SetIsOriginAllowed(origin => true) // allow any origin
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });

            var appSettings = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettings);
            var settings = appSettings.Get<AppSettings>();
            services.AddSingleton<IAppSettings>(settings);

            var identityServerSection = Configuration.GetSection(nameof(IdentityServerSection));
            services.Configure<IdentityServerSection>(identityServerSection);
            var idpSettings = identityServerSection.Get<IdentityServerSection>();
            services.AddSingleton<IIdentityServerSection>(idpSettings);
            services.AddScoped<IApiWebPrivadaHelper, ApiWebPrivadaHelper>();
            services.AddScoped(typeof(IRequestStoreStateContext<>), typeof(RequestStoreStateContext<>));
            services.AddScoped<IRequestStateFactory, RequestStateFactory>();

            services.ConfigureRequestLocalizationOptions();
            services.AddSharedLocalization<Strings>();
            services.AddAutoMapper(cfg => cfg.LicenseKey = settings.AutoMapper.LicenseKey,
                typeof(Startup).Assembly, typeof(MicroservicesProxy.Profiles.OperationProfile).Assembly, typeof(MicroservicesProxy.Profiles.RegisterProfile).Assembly);

            services.AddMvc(options =>
            {
                var serviceProvider = services.AddModelBindingMessageProvider<Strings>(options);
                options.ModelMetadataDetailsProviders.Add(serviceProvider.GetService<IValidationMetadataProvider>());
            })
            .AddViewLocalization()
            .AddDataAnnotationsLocalization(options => options.DataAnnotationLocalizerProvider = (_, factory) => factory.Create<Strings>())
            .AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });

            services.AddLogging();
            services.AddSingleton<TelemetryConfiguration>();


            services.AddHsts(options =>
            {
                options.Preload = true;
                options.IncludeSubDomains = true;
                options.MaxAge = TimeSpan.FromDays(60);
            });
            services.AddHttpContextAccessor();

            const string APPLICATION_NAME = "Bestinver.backoffice.App";
            if (!Env.IsDevelopment())
            {
                var dataProtectionConfiguration = Configuration.GetSection("DataProtection").Get<DataProtectionConfiguration>();
                var azCredential = GetAzCredential();
                services.AddDataProtection()
                    .PersistKeysToAzureBlobStorage(new Uri($"{dataProtectionConfiguration.AzureBlobStorageEndpoint}{dataProtectionConfiguration.AzureBlobStoragePath}"), azCredential)
                    .ProtectKeysWithAzureKeyVault(new Uri($"{dataProtectionConfiguration.AzureKeyVaultConfiguration.AzureKeyVaultEndpoint}{dataProtectionConfiguration.AzureKeyVaultKeyPath}"), azCredential)
                    .SetApplicationName(APPLICATION_NAME);
            }

            services.ConfigureOtel(APPLICATION_NAME, settings.AzureMonitor);

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
                tags: ["ready"]
            );


            services.AddCommonServices(Configuration);

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
        public void Configure(IApplicationBuilder app)
        {
            var fordwardedHeaderOptions = new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost
            };
            fordwardedHeaderOptions.KnownNetworks.Clear();
            fordwardedHeaderOptions.KnownProxies.Clear();

            app.UseForwardedHeaders(fordwardedHeaderOptions);

            string XOriginalHost = "X-ORIGINAL-HOST";

            app.Use((context, next) =>
            {
                if (context.Request.Headers.TryGetValue(XOriginalHost, out StringValues originalHostName))
                {
                    context.Request.Host = new HostString(originalHostName);
                }

                return next();
            });

            System.Web.HttpContext.Configure(app.ApplicationServices.GetRequiredService<IHttpContextAccessor>());


            var locOptions = app.ApplicationServices.GetService<IOptions<RequestLocalizationOptions>>();
            app.UseRequestLocalization(locOptions.Value);

            if (Env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseCors(corsPolicyName);
            }

            app.UseHsts();
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
                routes.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action}/{id?}",
                    defaults: new { controller = "Home", action = "Index" });
            });

        }
    }
}