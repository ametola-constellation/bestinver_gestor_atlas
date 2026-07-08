using AutoMapper;
using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.Controllers;
using Microsoft.Extensions.Options;
using BESTINVER.GestorAltas.Web.Management.FunctionalTests.Builders;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using SimpleInjector.Lifestyles;
using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.Controllers
{
    [TestClass]
    public class DashboardControllerTests
    {
        [TestMethod]
        public async Task LoadDniPendingSolveRequestTableTest()
        {
            var container = new DependenciesBuilder()
                                    .WithContainer()
                                    .WithDependencies()
                                    .Build();

            var jqueryParams = new Mock<JQueryDataTableParamModel>();

            jqueryParams.Setup(x => x.IDisplayLength).Returns(10);

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new DashboardController(container.GetInstance<IDashboardService>(), container.GetInstance<IMapper>(), Options.Create(new AppSettings()));

                var result = (await sut.LoadDniPendingSolveRequestTable(jqueryParams.Object).ConfigureAwait(false)) as JsonResult;
                var model = result.Value as JsonTableResultsModel;
                Assert.IsNotNull(result);
                Assert.IsNotNull(model);
                Assert.IsNotNull(model.AaData);
            }
        }

        [TestMethod]
        public async Task LoadPBCAlertsRequestTableTest()
        {
            var container = new DependenciesBuilder()
                                    .WithContainer()
                                    .WithDependencies()
                                    .Build();

            var jqueryParams = new Mock<JQueryDataTableParamModel>();

            jqueryParams.Setup(x => x.IDisplayLength).Returns(10);

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new DashboardController(container.GetInstance<IDashboardService>(), container.GetInstance<IMapper>(), Options.Create(new AppSettings()));

                var result = (await sut.LoadPBCAlertsRequestTable(jqueryParams.Object).ConfigureAwait(false)) as JsonResult;
                var model = result.Value as JsonTableResultsModel;
                Assert.IsNotNull(result);
                Assert.IsNotNull(model);
                Assert.IsNotNull(model.AaData);
            }
        }

        [TestMethod]
        public async Task LoadIncidenceAlertsRequestTableTest()
        {
            var container = new DependenciesBuilder()
                                    .WithContainer()
                                    .WithDependencies()
                                    .Build();

            var jqueryParams = new Mock<JQueryDataTableParamModel>();

            jqueryParams.Setup(x => x.IDisplayLength).Returns(10);

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new DashboardController(container.GetInstance<IDashboardService>(), container.GetInstance<IMapper>(), Options.Create(new AppSettings()));

                var result = (await sut.LoadIncidenceAlertsRequestTable(jqueryParams.Object).ConfigureAwait(false)) as JsonResult;
                var model = result.Value as JsonTableResultsModel;
                Assert.IsNotNull(result);
                Assert.IsNotNull(model);
                Assert.IsNotNull(model.AaData);
            }
        }

        [TestMethod]
        public async Task LoadLockedRequestTableTest()
        {
            var container = new DependenciesBuilder()
                                    .WithContainer()
                                    .WithDependencies()
                                    .Build();

            var jqueryParams = new Mock<JQueryDataTableParamModel>();

            jqueryParams.Setup(x => x.IDisplayLength).Returns(10);

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new DashboardController(container.GetInstance<IDashboardService>(), container.GetInstance<IMapper>(), Options.Create(new AppSettings()));

                var result = (await sut.LoadLockedRequestTable(jqueryParams.Object).ConfigureAwait(false)) as JsonResult;
                var model = result.Value as JsonTableResultsModel;
                Assert.IsNotNull(result);
                Assert.IsNotNull(model);
                Assert.IsTrue(model.AaData.Any());
            }
        }
    }
}