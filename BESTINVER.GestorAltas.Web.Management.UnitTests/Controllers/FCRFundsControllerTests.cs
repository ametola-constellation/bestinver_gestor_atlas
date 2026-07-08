using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using BESTINVER.GestorAltas.Web.Management.Controllers;
using BESTINVER.GestorAltas.Web.Management.Models.Operation;
using Microsoft.AspNetCore.Mvc;

namespace BESTINVER.GestorAltas.Web.Management.UnitTests.Controllers
{
    public class FCRFundsControllerTests : BaseTest
    {
        private FCRFundsController FCRFundsController { get; }
        public FCRFundsControllerTests()
        {
            var portfoliosService = new PortfoliosService(ApiWebPrivadaHelper);
            var productService = new ProductService(ApiWebPrivadaHelper);
            var operationService = new OperationsService(ApiWebPrivadaHelper);
            var customersService = new CustomersService(ApiWebPrivadaHelper);
            var dashboardService = new DashboardService(ApiWebPrivadaHelper);
            var requestStoreStateContext = new RequestStoreStateContext<RequestValidation>();
            var requestStateFactory = new RequestStateFactory(Mapper, requestStoreStateContext);
            var requestService = new RequestService(ApiWebPrivadaHelper, requestStateFactory);


            var filesService = new FilesService(ApiWebPrivadaHelper);
            var signaturesService = new SignaturesService(ApiWebPrivadaHelper);
            var applicantService = new ApplicantService(ApiWebPrivadaHelper);
            var adviceProductService = new AdviceProductService(ApiWebPrivadaHelper, requestService, applicantService);

            FCRFundsController = new FCRFundsController(portfoliosService,
                                                        productService,
                                                        operationService,
                                                        customersService,
                                                        dashboardService,
                                                        requestService,
                                                        signaturesService,
                                                        adviceProductService,
                                                        filesService,
                                                        ConfigureLogger<FCRFundsController>(),
                                                        AppSettings);
        }

        [Fact]
        public void IndexTest()
        {
            // Act
            var result = this.FCRFundsController.Index();

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(((ViewResult)result).Model);
            Assert.NotNull(((ViewResult)result).ViewData);
        }

        [Fact]
        public void ShowSendPreviousDocumentationTest()
        {
            // Act
            var result = this.FCRFundsController.ShowSendPreviousDocumentation();

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(((PartialViewResult)result).ViewData);
        }

        [Fact]
        public void ShowInfoTest()
        {
            // Arrange
            var model = new OperationInfoModel();

            // Act
            var result = this.FCRFundsController.ShowInfo(model);
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
            var result = await this.FCRFundsController.CreateFileOperations(model);
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
            var result = await this.FCRFundsController.SolveRequestStatusOperation(requestID, accepted);
            var jsonResult = result as JsonResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(jsonResult);
            Assert.NotNull(jsonResult.Value);
        }
    }
}
