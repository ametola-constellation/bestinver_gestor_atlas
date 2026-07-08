using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.FunctionalTests.Builders;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SimpleInjector.Lifestyles;
using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.Services
{
    //[TestClass]
    //public class RequestServiceTest
    //{
    //    private DependenciesBuilder dependenciesBuilder;

    //    [TestInitialize]
    //    public void Init(DependenciesBuilder dependenciesBuilder)
    //    {
    //        this.dependenciesBuilder = dependenciesBuilder.WithContainer().WithDependencies();
    //    }

    //    [TestMethod]
    //    public async Task GetRequest_Test()
    //    {
    //        var container = dependenciesBuilder.Build();
    //        using (var scope = AsyncScopedLifestyle.BeginScope(container))
    //        {
    //            var service = container.GetInstance<IRequestService>();
    //            var requestID = new Guid("9d701088-725b-485e-bc8d-4407803c5ebb");
    //            var result = await service.GetRequest(requestID).ConfigureAwait(false);
    //            Assert.IsTrue(result != null);
    //        }
    //    }

    //    [TestMethod]
    //    public async Task CreateRequest_Test()
    //    {
    //        var container = dependenciesBuilder.Build();
    //        using (var scope = AsyncScopedLifestyle.BeginScope(container))
    //        {
    //            var service = container.GetInstance<ISignUpService>();
    //            var request = new RequestData
    //            {
    //                IdInitialProduct = 1,
    //                IdRequestChannel = (int)RequestChannelType.Publica,
    //                RequestId = Guid.NewGuid(),
    //                RequestStartDate = DateTime.UtcNow,
    //                Web = true,
    //                AgentShippingMail = "test",
    //                IdSalesChannel = (int)SalesChannelType.Presencial,
    //                ManagedByCommercial = true,
    //                SignatureType = (int)RequestSignatureType.Indistinta,
    //                Username = "test",
    //                UtmCampaign = "UtmCampaign",
    //                UtmContent = "UtmContent",
    //                UtmMedium = "UtmMedium",
    //                UtmSource = "UtmSource",
    //                UtmTerm = "UtmTerm",
    //                IdRequest = "18-10-2018-02"
    //            };
    //            var result = await service.InsertRequest(request).ConfigureAwait(false);
    //            Assert.IsTrue(result != null);
    //        }
    //    }

    //    [TestMethod]
    //    public async Task UpdateRequest_Test()
    //    {
    //        var container = dependenciesBuilder.Build();
    //        using (var scope = AsyncScopedLifestyle.BeginScope(container))
    //        {
    //            var service = container.GetInstance<IRequestService>();
    //            var requestID = new Guid("9d701088-725b-485e-bc8d-4407803c5ebb");
    //            var result = await service.GetRequest(requestID).ConfigureAwait(false);

    //            if (result != null)
    //            {
    //                result.IdInitialProduct = 2;
    //                result.web = true;
    //                result.AgentShippingMail = "test";
    //                result.IdSalesChannel = (int)SalesChannelType.Presencial;
    //                result.ManagedByCommercial = true;
    //                result.IdRequestSignature = (int)RequestSignatureType.Indistinta;
    //                result.Username = "test";
    //                result.utm_campaign = "UtmCampaign";
    //                result.utm_content = "UtmContent";
    //                result.utm_medium = "UtmMedium";
    //                result.utm_source = "UtmSource";
    //                result.utm_term = "UtmTerm";
    //                result.IdRequestChannel = (int)RequestChannelType.Publica;
    //                result = await service.UpdateRequest(result).ConfigureAwait(false);
    //            }
    //            Assert.IsTrue(result != null);
    //        }
    //    }
    //}
}