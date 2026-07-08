using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using BESTINVER.GestorAltas.Web.Management.Controllers;
using BESTINVER.GestorAltas.Web.Management.Models.Operation;
using Microsoft.AspNetCore.Mvc;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.ControllersV2
{
    public class OperationControllerTests : BaseTest
    {
        private OperationController operationController { get; }
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

            this.operationController = new OperationController(dashboardService, requestService, Mapper, filesService, productService, ConfigureLogger<OperationController>(), AppSettings, signaturesService, operationsService); this.operationController.ControllerContext.HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null");
        }

        //[Fact]
        internal async Task IndexTest()
        {

            // Act
            var result = await this.operationController.Index();

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async Task LoadDataTableTest()
        {
            // Arrange
            var model = new OperationController.SearchModel();

            // Act
            var result = await this.operationController.LoadDataTable(model);
            var jsonResult = result as JsonResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(jsonResult);
            Assert.NotNull(jsonResult.Value);
        }

        [Fact]
        public async Task OperationDetailTest()
        {
            // Arrange
            var requestID = Guid.NewGuid();

            // Act
            var result = await this.operationController.OperationDetail(requestID);
            var partialViewResult = result as PartialViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(partialViewResult);
            Assert.NotNull(partialViewResult.ViewData);
        }

        [Fact]
        public async Task StatusDetailTest()
        {
            // Arrange
            var requestID = Guid.NewGuid();

            // Act
            var result = await this.operationController.StatusDetail(requestID);
            var partialViewResult = result as PartialViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(partialViewResult);
            Assert.NotNull(partialViewResult.ViewData);
        }

        [Fact]
        public async Task GetPDFTest()
        {
            // Arrange
            var model = new OperationInfoModel() { RequestIds = [Guid.NewGuid()] };

            // Act
            var result = await this.operationController.GetPDF(model);
            var fileResult = result as FileContentResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(fileResult);
            Assert.NotNull(fileResult.ContentType);
        }

        [Fact]
        public async Task ShowDocumentsTest()
        {
            // Arrange
            var requestID = Guid.NewGuid();

            // Act
            var result = await this.operationController.ShowDocuments(requestID);
            var partialViewResult = result as PartialViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(partialViewResult);
            Assert.NotNull(partialViewResult.ViewData);
        }

        [Fact]
        public async Task ShowSignatureStatusTest()
        {
            // Arrange
            var requestID = Guid.NewGuid();

            // Act
            var result = await this.operationController.ShowSignatureStatus(requestID);
            var partialViewResult = result as PartialViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(partialViewResult);
            Assert.NotNull(partialViewResult.ViewData);
        }
    }
}
