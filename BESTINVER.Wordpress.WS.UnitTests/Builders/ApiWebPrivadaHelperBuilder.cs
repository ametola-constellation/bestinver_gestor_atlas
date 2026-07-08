using BESTINVER.GestorAltas.Domain.Interfaces;
using Moq;

namespace BESTINVER.Wordpress.WS.Tests.Builders
{
    using BESTINVER.GestorAltas.MicroservicesProxy;
    using BESTINVER.GestorAltas.Web.Management.Common;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Logging;
    using System.Net.Http;
    using static BestInver.WebPrivada.Shared.Models.Shared.Const.Api;

    public class ApiWebPrivadaHelperBuilder
    {
        public IAppSettings configurationManager;
        public IIdentityServerSection identityServerConfig;
        public IRemediacionUser remediacionUser;
        public IHttpContextAccessor httpContextAccessor;
        public IHttpClientFactory httpClientFactory;
        public ILogger<ApiWebPrivadaHelper> logger;
        public Microsoft.Extensions.Configuration.IConfiguration configuration;

        public ApiWebPrivadaHelperBuilder WithDefaultDevSettings()
        {
            var configurationManagerMock = new Mock<IAppSettings>();
            configurationManagerMock.Setup(x => x.ApiWebPrivadaBaseAddress).Returns("http://bestinver.net/");
            configurationManager = configurationManagerMock.Object;

            var identityServerSectionMock = new Mock<IIdentityServerSection>();
            identityServerSectionMock.Setup(x => x.Authority).Returns("https://bestinver-id-dev.azurewebsites.net/");
            identityServerSectionMock.Setup(x => x.ClientId).Returns("openIdBestInver2");
            identityServerSectionMock.Setup(x => x.ClientSecret).Returns("superSecretPassword");
            identityServerSectionMock.Setup(x => x.Scopes).Returns($"{TestsAPI} {RequestsAPI} {AlertsAPI} {DashboardsAPI} {CarterasAPI} {CustomersAPI} {UserAPI} {OperationAPI} {SignUpAPI} {SignaturesAPI} {SendEmailAPI} {ProductsAPI}");

            identityServerConfig = identityServerSectionMock.Object;

            var configurationMock = new Mock<Microsoft.Extensions.Configuration.IConfiguration>();
            var configurationSectionMock = new Mock<Microsoft.Extensions.Configuration.IConfigurationSection>();
            configurationMock.Setup(x => x.GetSection("MasterProductClasses")).Returns(configurationSectionMock.Object);
            configuration = configurationMock.Object;

            var remediationUserMock = new Mock<IRemediacionUser>();
            remediationUserMock.Setup(x => x.GetUser()).Returns("");
            remediacionUser = remediationUserMock.Object;

            var httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            var context = new DefaultHttpContext();
            httpContextAccessorMock.Setup(_ => _.HttpContext).Returns(context);
            httpContextAccessor = httpContextAccessorMock.Object;

            var mockHttpClientFactory = new Mock<IHttpClientFactory>();
            var mockHttpClient = new Mock<HttpClient>();
            mockHttpClientFactory.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(mockHttpClient.Object);
            httpClientFactory = mockHttpClientFactory.Object;

            var loggerMock = new Mock<ILogger<ApiWebPrivadaHelper>>();
            logger = loggerMock.Object;

            return this;
        }

        public  BESTINVER.GestorAltas.MicroservicesProxy.ApiWebPrivadaHelper Build()
        {
            return new BESTINVER.GestorAltas.MicroservicesProxy.ApiWebPrivadaHelper(configurationManager, httpContextAccessor, logger, httpClientFactory);
        }
    }
}
