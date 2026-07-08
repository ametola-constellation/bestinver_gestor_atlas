using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using BESTINVER.GestorAltas.Web.Management.Controllers;
using BESTINVER.GestorAltas.Web.Management.Models.FcrFunds;
using BESTINVER.GestorAltas.Web.Management.Models.PeriodicsOperations;
using Microsoft.AspNetCore.Mvc;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.ControllersV2
{
    public class FCRFundsControllerTests:BaseTest
    {
        private FCRFundsController fCRFundsController { get; }
        public FCRFundsControllerTests() {
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

            fCRFundsController = new FCRFundsController(portfoliosService,
                                                        productService,
                                                        operationService,
                                                        customersService,
                                                        dashboardService,
                                                        requestService,
                                                        signaturesService,
                                                        adviceProductService,
                                                        filesService,
                                                        ConfigureLogger<FCRFundsController>(),
                                                        AppSettings)
            {
                ControllerContext = new ControllerContext() { HttpContext = GetHttpContextAccessor().HttpContext ?? throw new InvalidOperationException("HttpContext is null") }
            };
        }

        [Fact]
        public async Task ShowCreateNewSubscriptionFCRAsyncTest()
        {
            // Arrange 
            var idAccount = 50102;

            // Act
            var result = await this.fCRFundsController.ShowCreateNewSubscriptionFCRAsync(idAccount);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(((PartialViewResult)result).ViewData);

        }

        //[Fact]
        internal async Task SendDocumentationTest()
        {
            // Arrange 
            var model = new RequestFCRFundModel() { DocumentNumber = "", Amount = 1000, ProductId = 0, Username = "", Files = null, CustomerId = 50102, AccountId = 100196 };

            // Act
            var result = await this.fCRFundsController.SendDocumentation(model);

            // Assert
            Assert.NotNull(result);

        }

        [Fact]
        public async Task SearchAccountTest()
        {
            // Arrange
            var createPeriodicOperation = new CreatePeriodicOperation()
            {
                DNI = "03780635X"
            };

            // Act
            var result = await this.fCRFundsController.SearchAccount(createPeriodicOperation);
            var jsonResult = result as JsonResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(jsonResult);
            Assert.NotNull(jsonResult.Value);
        }

        [Fact]
        public async Task LoadDataTableTest()
        {
            // Arrange
            var model = new FCRFundsController.SearchModel();

            // Act
            var result = await this.fCRFundsController.LoadDataTable(model);
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
            var result = await this.fCRFundsController.OperationDetail(requestID);
            var partialViewResult = result as PartialViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(partialViewResult);
            Assert.NotNull(partialViewResult.ViewData);
        }

        [Fact]
        public async Task ShowDocumentsTest()
        {
            // Arrange
            var requestID = Guid.NewGuid();

            // Act
            var result = await this.fCRFundsController.ShowDocuments(requestID);
            var partialViewResult = result as PartialViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(partialViewResult);
            Assert.NotNull(partialViewResult.ViewData);
        }
    }
}
