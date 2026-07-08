using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BESTINVER.GestorAltas.Web.Management.UnitTests.Controllers
{
    public class DashboardControllerTests : BaseTest
    {
        private DashboardController DashboardController { get; }

        public DashboardControllerTests()
        {
            var dashboardService = new DashboardService(this.ApiWebPrivadaHelper);
            var appSettings = Options.Create(new AppSettings());
            appSettings.Value.Dashboard = new DashboardSettings() { AllowedRoles = new List<string> { "Admin", "User" } };
            this.DashboardController = new DashboardController(dashboardService, Mapper, appSettings)
            {
                ControllerContext = new ControllerContext() { HttpContext = GetHttpContextAccessor().HttpContext ?? throw new InvalidOperationException("HttpContext is null") }
            };
        }

        [Fact]
        public void IndexTest()
        {

            // Act
            var result = this.DashboardController.Index();
            var viewResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewData);
        }
    }
}
