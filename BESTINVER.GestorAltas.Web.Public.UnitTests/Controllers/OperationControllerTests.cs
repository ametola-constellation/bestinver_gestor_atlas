using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using BESTINVER.GestorAltas.Web.Management.Controllers;
using BESTINVER.GestorAltas.Web.Management.Models;
using BESTINVER.GestorAltas.Web.Management.Models.Operation;
using BESTINVER.GestorAltas.Web.Public.UnitTests;
using Microsoft.AspNetCore.Mvc;

namespace BESTINVER.GestorAltas.Web.Management.UnitTests.Controllers
{
    public class OperationControllerTests : BaseTest
    {
        private OperationController OperationController { get; }
        public OperationControllerTests()
        {

            var dashboardService = new DashboardService(ApiWebPrivadaHelper);
            var requestStoreStateContext = new RequestStoreStateContext<RequestValidation>();
            var requestStateFactory = new RequestStateFactory(Mapper, requestStoreStateContext);
            var requestService = new RequestService(ApiWebPrivadaHelper, requestStateFactory);
            var filesService = new FilesService(ApiWebPrivadaHelper);
            var productService = new ProductService(ApiWebPrivadaHelper);
            var signaturesService = new SignaturesService(ApiWebPrivadaHelper);
            var operationsService = new OperationsService(ApiWebPrivadaHelper);

            this.OperationController = new OperationController(dashboardService, requestService, Mapper, filesService, productService, ConfigureLogger<OperationController>(), AppSettings, signaturesService, operationsService);
            this.OperationController.ControllerContext.HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null");
        }

        [Fact]
        public void ShowInfoTest()
        {
            // Arrange
            var model = new OperationInfoModel();

            // Act
            var result = this.OperationController.ShowInfo(model);
            var partialViewResult = result as PartialViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(partialViewResult);
            Assert.NotNull(partialViewResult.ViewData);
        }

        [Fact]
        public async Task CreateFileOperationsTest()
        {
            // Arrange
            var model = new OperationInfoModel();

            // Act
            var result = await this.OperationController.CreateFileOperations(model);
            var jsonResult = result as JsonResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(jsonResult);
            Assert.NotNull(jsonResult.Value);
        }

        [Fact]
        public async Task CreateOrUpdateStatusOperationTest()
        {
            // Arrange
            var model = new RequestStatus();

            // Act
            var result = await this.OperationController.CreateOrUpdateStatusOperation(model);
            var jsonResult = result as JsonResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(jsonResult);
            Assert.NotNull(jsonResult.Value);
        }

        [Fact]
        public async Task SolveRequestStatusOperationTest()
        {
            // Arrange
            var requestID = Guid.NewGuid();
            bool accepted = false;

            // Act
            var result = await this.OperationController.SolveRequestStatusOperation(requestID, accepted);
            var jsonResult = result as JsonResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(jsonResult);
            Assert.NotNull(jsonResult.Value);
        }

        [Fact]
        public async Task SendSignatureReplayTest()
        {
            // Arrange
            var model = new List<OperationApplicantSignatureModel>() { new() { RequestId = Guid.NewGuid() } };

            // Act
            var result = await this.OperationController.SendSignatureReplay(model);
            var jsonResult = result as JsonResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(jsonResult);
            Assert.NotNull(jsonResult.Value);
        }
    }
}
