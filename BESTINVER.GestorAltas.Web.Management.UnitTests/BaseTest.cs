using System.Reflection;
using System.Security.Claims;
using AutoMapper;
using BESTINVER.GestorAltas.Domain;
using BESTINVER.GestorAltas.MicroservicesProxy;
using BESTINVER.GestorAltas.Web.Management.Common;
using BESTINVER.GestorAltas.Web.Management.Profiles;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using AppSettings = BESTINVER.GestorAltas.Domain.Configurations.AppSettings;

namespace BESTINVER.GestorAltas.Web.Management.UnitTests
{
    public class BaseTest
    {
        private static readonly List<Assembly> assemblies = [];

        private static readonly Lazy<IMapper> _mapper = new(() =>
        {
            static void configAction(IMapperConfigurationExpression c)
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

        public ApiWebPrivadaHelper ApiWebPrivadaHelper
        {
            get
            {
                return new ApiWebPrivadaHelper(AppSettings.Value, HttpContextAccessor, ConfigureLogger<ApiWebPrivadaHelper>(), HttpClientFactory);
            }
        }

        public static IOptions<AppSettings> AppSettings
        {
            get
            {
                var appSettings = new AppSettings
                {
                    ApiWebPrivadaBaseAddress = "https://bestinver.net/"
                };

                var mockAppSettings = new Mock<IOptions<AppSettings>>();
                mockAppSettings.Setup(x => x.Value).Returns(appSettings);

                return mockAppSettings.Object;
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

            // Mock ITempDataDictionaryFactory for PartialView support
            var mockTempDataDictionaryFactory = new Mock<ITempDataDictionaryFactory>();
            var mockTempDataDictionary = new Mock<ITempDataDictionary>();
            mockTempDataDictionaryFactory.Setup(x => x.GetTempData(It.IsAny<HttpContext>())).Returns(mockTempDataDictionary.Object);
            
            // Setup service provider with required services
            var mockServiceProvider = new Mock<IServiceProvider>();
            mockServiceProvider.Setup(x => x.GetService(typeof(ITempDataDictionaryFactory))).Returns(mockTempDataDictionaryFactory.Object);
            context.RequestServices = mockServiceProvider.Object;

            //context.Request.Headers["Authorization"] = GetToken().Result;
            mockHttpContextAccessor.Setup(_ => _.HttpContext).Returns(context);
            System.Web.HttpContext.Configure(mockHttpContextAccessor.Object);
            return mockHttpContextAccessor.Object;
        }

        public static IHttpClientFactory GetHttpClientFactory()
        {
            var mockHttpClientFactory = new Mock<IHttpClientFactory>();
            var mockHttpClient = new Mock<HttpClient>();
            mockHttpClientFactory.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(mockHttpClient.Object);
            return mockHttpClientFactory.Object;
        }

        public static IIdentityServerSection GetIdentityServerSection()
        {
            var identityServerSectionMock = new Mock<IIdentityServerSection>();
            identityServerSectionMock.Setup(x => x.Authority).Returns("https://bestinver-id-dev.azurewebsites.net/");
            identityServerSectionMock.Setup(x => x.ClientId).Returns("openIdBestInver2");
            identityServerSectionMock.Setup(x => x.ClientSecret).Returns("superSecretPassword");
            identityServerSectionMock.Setup(x => x.Scopes).Returns("customersAPI operationsAPI portfoliosAPI productsAPI usersAPI filesAPI smsAPI testsAPI alertsAPI requestsAPI dashboardsAPI customizationsAPI remediationAPI signaturesAPI carterasAPI signupAPI campaignsAPI sendemailAPI crmAPI amlAPI authoperationsAPI movementsAPI");
            return identityServerSectionMock.Object;
        }
    }
}
