using System.Reflection;
using System.Security.Claims;
using AutoMapper;
using Bestinver.Auth.Ldap.Models;
using BestInver.Core.Http.Extensions;
using BestInver.Core.Models.AppSettings;
using BESTINVER.GestorAltas.Domain;
using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.MicroservicesProxy;
using BESTINVER.GestorAltas.Web.Management.Profiles;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using AppSettings = BESTINVER.GestorAltas.Domain.Configurations.AppSettings;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests
{
    public class BaseTest
    {
        private static List<Assembly> assemblies = [];

        private static readonly Lazy<IMapper> _mapper = new(() =>
        {
            void configAction(IMapperConfigurationExpression c)
            {
                AddAssemblyProfiles(c);
            }
            var mapperConfig = new MapperConfiguration(configAction, Microsoft.Extensions.Logging.Abstractions.NullLoggerFactory.Instance);
            return mapperConfig.CreateMapper();
        });


        private static void AddAssemblyProfiles(IMapperConfigurationExpression cfg)
        {
            assemblies.Add(typeof(TableResultProfile).Assembly);
            if (!assemblies.Contains(typeof(AutoMapperConfig).Assembly))
            {
                assemblies.Add(typeof(AutoMapperConfig).Assembly);
            }

            assemblies.ForEach(x => GetAssemblyProfiles(x).ForEach(cfg.AddProfile));
        }

        private static List<Profile> GetAssemblyProfiles(Assembly assembly)
        {
            return (from t in assembly.GetTypes()
                    where typeof(Profile).IsAssignableFrom(t)
                    select (Profile)Activator.CreateInstance(t)!).ToList();
        }

        public static IMapper Mapper { get { return _mapper.Value; } }

        public ApiWebPrivadaHelper ApiWebPrivadaHelper { 
            get {
                return new ApiWebPrivadaHelper(AppSettings.Value, HttpContextAccessor, ConfigureLogger<ApiWebPrivadaHelper>(), HttpClientFactory); 
            } 
        }

        public IOptions<GraphSettings> LdapSettingsOptions
        {
            get
            {
                var ldapSettings = GetSection("GraphSettings").Get<GraphSettings>() ?? throw new InvalidOperationException("LdapSettings section is missing or invalid in the configuration.");
                var ldapSettingsMapped = Options.Create(ldapSettings);
                return ldapSettingsMapped;
            }
        }

        public IOptions<AppSettings> AppSettings
        {
            get
            {
                var appSettings = GetSection("AppSettings").Get<AppSettings>() ?? throw new InvalidOperationException("AppSettings section is missing or invalid in the configuration.");
                var appSettingsMapped = Options.Create(appSettings);
                return appSettingsMapped;
            }
        }

        public IOptions<LocalizationOptions> LocalizationOptions
        {
            get
            {
                var appSettings = GetSection("AppSettings");
                var localizationOptions = appSettings.Get<LocalizationOptions>();
                return localizationOptions == null
                    ? throw new InvalidOperationException("LocalizationOptions section is missing or invalid in the configuration.")
                    : Options.Create(localizationOptions);
            }
        }

        public IHttpContextAccessor HttpContextAccessor { get { return GetHttpContextAccessor(); } }

        public IHttpClientFactory HttpClientFactory { get { return GetHttpClientFactory(HttpContextAccessor); } }

        /// <summary>
        /// Configure logger factory
        /// </summary>
        /// <param name="loggerFactory"></param>
        public static ILogger<T> ConfigureLogger<T>()
        {
            return Mock.Of<ILogger<T>>();
        }

        public static IHttpContextAccessor GetHttpContextAccessor()
        {
            var context = new DefaultHttpContext();
            context.Request.Headers.Accept = "*/*";
            context.Request.Headers.AcceptEncoding = "gzip, deflate, br";
            context.Request.Headers.Connection = "keep-alive";
            var claimIentity = new ClaimsIdentity(
            [
                new Claim(ClaimTypes.Role, "Admin"),
                new Claim(ClaimTypes.Name, "admin@bestinver.es")
            ]);
            context.User = new ClaimsPrincipal(claimIentity);
            context.TraceIdentifier = "";

            var mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
            mockHttpContextAccessor.Setup(_ => _.HttpContext).Returns(context);

            return mockHttpContextAccessor.Object;
        }

        public static IHttpClientFactory GetHttpClientFactory(IHttpContextAccessor httpContextAccessor)
        {
            var services = new ServiceCollection();

            services.AddDistributedMemoryCache();
            services.AddMemoryCache();
            services.AddSingleton(httpContextAccessor);
            var idpSettings = GetSection("IdentityServerSection").Get<IdentityServerSection>();
            services.ConfigureHttpClients(
               new Oidc
               {
                   Authority = idpSettings.Authority,
                   ClientId = idpSettings.ClientId,
                   ClientSecret = idpSettings.ClientSecret,
                   Scope = idpSettings.Scopes.Split(" ").ToList()
               });

            services.AddHttpClient();
            var serviceProvider = services.BuildServiceProvider();

            return serviceProvider.GetRequiredService<IHttpClientFactory>();
        }

        private static IConfigurationRoot GetConfigSettings()
        {
            var config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();
            return config;
        }

        private static IConfigurationSection GetSection(string sectionName)
        {
            IConfigurationRoot config = GetConfigSettings();
            return config.GetSection(sectionName);
        }
    }


}
