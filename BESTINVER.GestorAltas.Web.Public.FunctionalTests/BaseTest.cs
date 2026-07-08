using System.Reflection;
using System.Security.Claims;
using AutoMapper;
using BestInver.Core.Http.Extensions;
using BestInver.Core.Models.AppSettings;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests;
using BESTINVER.GestorAltas.Domain;
using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.MicroservicesProxy;
using BESTINVER.GestorAltas.Web.Public.Models.Register;
using BESTINVER.GestorAltas.Web.Public.Profiles;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using AppSettings = BESTINVER.GestorAltas.Domain.Configurations.AppSettings;

namespace BESTINVER.GestorAltas.Web.Public.FunctionalTests
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
            if (!assemblies.Contains(typeof(AutoMapperConfig).Assembly))
            {
                assemblies.Add(typeof(AutoMapperConfig).Assembly);
            }
            assemblies.Add(typeof(CheckConvenienceData).Assembly);
            assemblies.Add(typeof(ConvenienceRequest).Assembly);
            assemblies.Add(typeof(MasterDataModel).Assembly);

            assemblies.ForEach(x => GetAssemblyProfiles(x).ForEach(cfg.AddProfile));
        }

        private static List<Profile> GetAssemblyProfiles(Assembly assembly)
        {
            var profiles = (from t in assembly.GetTypes()
                    where typeof(Profile).IsAssignableFrom(t)
                    select (Profile)Activator.CreateInstance(t)!).ToList();
            profiles.Add((Profile)Activator.CreateInstance(new QuestionProfile().GetType())!);
            profiles.Add((Profile)Activator.CreateInstance(new ProductModelProfile().GetType())!);
            return profiles;
        }

        public static IMapper Mapper { get { return _mapper.Value; } }

        public ApiWebPrivadaHelper ApiWebPrivadaHelper
        {
            get
            {
                return new ApiWebPrivadaHelper(AppSettings.Value, HttpContextAccessor, ConfigureLogger<ApiWebPrivadaHelper>(), HttpClientFactory);
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

        public IHttpContextAccessor HttpContextAccessor { get { return GetHttpContextAccessor(); } }

        public IHttpClientFactory HttpClientFactory { get { return GetHttpClientFactory(); } }

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
            var mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
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

            //context.Request.Headers["Authorization"] = GetToken().Result;
            mockHttpContextAccessor.Setup(_ => _.HttpContext).Returns(context);
            //System.Web.HttpContext.Configure(mockHttpContextAccessor.Object);
            return mockHttpContextAccessor.Object;
        }

        public static IHttpClientFactory GetHttpClientFactory()
        {
            var services = new ServiceCollection();

            services.AddDistributedMemoryCache();
            services.AddMemoryCache();
            services.AddSingleton(GetHttpContextAccessor());
            var idpSettings = GetSection("IdentityServerSection").Get<IdentityServerSection>();
            if (idpSettings != null)
            {
                services.ConfigureHttpClients(
                   new Oidc
                   {
                       Authority = idpSettings.Authority,
                       ClientId = idpSettings.ClientId,
                       ClientSecret = idpSettings.ClientSecret,
                       Scope = idpSettings.Scopes.Split(" ").ToList()
                   });
            }
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
