using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BESTINVER.GestorAltas.Web.Management.Controllers;
using BESTINVER.GestorAltas.Web.Management.FunctionalTests.Builders;
using BESTINVER.GestorAltas.Web.Management.Models;
using BESTINVER.GestorAltas.Web.Management.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SimpleInjector.Lifestyles;
using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.Controllers
{
    [TestClass]
    public class DetailsControllerTests
    {
        [TestMethod]
        public async Task GetApplicantTestTest()
        {
            var container = new DependenciesBuilder()
              .WithContainer()
              .WithDependencies()
              .Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                Guid.TryParse("3a0933d1-41e4-41ee-9b11-776bdc262f3d", out Guid requestId);

                var sut = container.GetInstance<DetailsController>();
                var result = (await sut.GetApplicantTest(requestId).ConfigureAwait(false) as JsonResult)?.Value as IEnumerable<ApplicantTestsViewModel>;

                Assert.IsNotNull(result);
                Assert.IsTrue(result.Any());
            }
        }

        [TestMethod]
        public async Task GetIndexTest()
        {
            var container = new DependenciesBuilder()
              .WithContainer()
              .WithDependencies()
              .Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                Guid.TryParse("5f822a37-80cb-4895-af4e-98b817c54282", out Guid requestId);

                var sut = container.GetInstance<DetailsController>();
                var result = (await sut.Index(requestId).ConfigureAwait(false) as ViewResult);

                Assert.IsNotNull(result.Model);
            }
        }

        [TestMethod]
        public async Task ResolveAlertTest()
        {
            var container = new DependenciesBuilder()
               .WithContainer()
               .WithDependencies()
               .Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                Guid.TryParse("5f822a37-80cb-4895-af4e-98b817c54282", out Guid requestId);

                var requestAlertModel = new ResolveAlertModel
                {
                    RequestId = requestId,
                    Responsbile = "Test user",
                    EndDate = DateTime.Now,
                    AlertStatus = (int)AlertStatus.Accepted,
                    Comments = "Test Comments",
                };
                var sut = container.GetInstance<DetailsController>();
                var result = (await sut.ResolveAlert(requestAlertModel).ConfigureAwait(false) as ViewResult);

                Assert.IsNotNull(result.Model);
            }
        }
    }
}