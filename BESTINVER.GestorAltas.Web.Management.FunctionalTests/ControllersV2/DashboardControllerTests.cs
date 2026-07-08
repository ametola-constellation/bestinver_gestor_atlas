using AutoMapper;
using BESTINVER.GestorAltas.Domain;
using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using Microsoft.Extensions.Options;
using BESTINVER.GestorAltas.Web.Management.Controllers;
using BESTINVER.GestorAltas.Web.Management.Profiles;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.ControllersV2
{
    public class DashboardControllerTests: BaseTest
    {
        private DashboardController dashboardController { get; }

        protected readonly IMapper mapper;

        public DashboardControllerTests() {
            string fileAppSettingsJson = $"{System.Environment.CurrentDirectory.Replace("\\bin\\Debug\\net6.0", string.Empty)}\\appsettings.json";
            var config = new ConfigurationBuilder().AddJsonFile(fileAppSettingsJson).Build();

            mapper = AutoMapperConfig.GetConfiguration([
                typeof(TableResultProfile).Assembly
            ]).CreateMapper();

            var dashboardService = new DashboardService(this.ApiWebPrivadaHelper);
            this.dashboardController = new DashboardController(dashboardService, Mapper, Options.Create(new AppSettings()))
            {
                ControllerContext = new ControllerContext() { HttpContext = GetHttpContextAccessor().HttpContext ?? throw new InvalidOperationException("HttpContext is null") }
            };
        }

        [Fact]
        public async Task LoadLockedRequestTableTest()
        {
            // Arrange
            var jQueryDataTableParamModel = new JQueryDataTableParamModel() { IDisplayLength = 10, IDisplayStart = 0, SSortDir_0 = "asc" };

            // Act
            var result = (await dashboardController.LoadLockedRequestTable(jQueryDataTableParamModel)) as JsonResult;
            var model = result?.Value as JsonTableResultsModel;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(model);
            Assert.NotNull(model.AaData);
        }

        [Fact]
        public async Task LoadDniPendingSolveRequestTableTest()
        {
            // Arrange
            var jqueryParams = new JQueryDataTableParamModel() { IDisplayLength = 10 };
            
            // Act
            var result = (await dashboardController.LoadDniPendingSolveRequestTable(jqueryParams)) as JsonResult;
            var model = result?.Value as JsonTableResultsModel;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(model);
            Assert.NotNull(model.AaData);
            Assert.NotEmpty(model.AaData);
        }

        [Fact]
        public async Task LoadPendingRequestTableTest() {

            // Arrange
            var parameters = new JQueryDataTableParamModel() { IDisplayLength = 10, IDisplayStart = 0, SSortDir_0 = "asc" };

            // Act 
            var result = await this.dashboardController.LoadPendingRequestTable(parameters);
            var model = ((JsonResult)result).Value as JsonTableResultsModel;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(model);
            Assert.NotNull(model.AaData);
            Assert.NotEmpty(model.AaData);
        }

        [Fact]
        public async Task LoadSignAlertsRequestTableTest()
        {

            // Arrange
            var parameters = new JQueryDataTableParamModel() { IDisplayLength = 10, IDisplayStart = 0, SSortDir_0 = "asc" };

            // Act 
            var result = await this.dashboardController.LoadSignAlertsRequestTable(parameters);
            var model = ((JsonResult)result).Value as JsonTableResultsModel;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(model);
            Assert.NotNull(model.AaData);
            Assert.NotEmpty(model.AaData);
        }

        [Fact]
        public async Task LoadPBCAlertsRequestTableTest()
        {

            // Arrange
            var parameters = new JQueryDataTableParamModel() { IDisplayLength = 10, IDisplayStart = 0, SSortDir_0 = "asc" };

            // Act 
            var result = await this.dashboardController.LoadPBCAlertsRequestTable(parameters);
            var model = ((JsonResult)result).Value as JsonTableResultsModel;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(model);
            Assert.NotNull(model.AaData);
            Assert.NotEmpty(model.AaData);
        }

        [Fact]
        public async Task LoadIncidenceAlertsRequestTableTest()
        {

            // Arrange
            var parameters = new JQueryDataTableParamModel() { IDisplayLength = 10, IDisplayStart = 0, SSortDir_0 = "asc" };

            // Act 
            var result = await this.dashboardController.LoadIncidenceAlertsRequestTable(parameters);
            var model = ((JsonResult)result).Value as JsonTableResultsModel;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(model);
            Assert.NotNull(model.AaData);
            Assert.NotEmpty(model.AaData);
        }

        [Fact]
        public async Task LoadPostalRequestTableTest()
        {

            // Arrange
            var parameters = new JQueryDataTableParamModel() { IDisplayLength = 10, IDisplayStart = 0, SSortDir_0 = "asc" };

            // Act 
            var result = await this.dashboardController.LoadPostalRequestTable(parameters);
            var model = ((JsonResult)result).Value as JsonTableResultsModel;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(model);
            Assert.NotNull(model.AaData);
            Assert.NotEmpty(model.AaData);
        }
    }
}
