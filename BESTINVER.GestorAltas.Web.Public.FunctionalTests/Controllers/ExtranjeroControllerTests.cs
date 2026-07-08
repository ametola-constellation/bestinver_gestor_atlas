using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using BESTINVER.GestorAltas.Web.Public.Controllers;
using BESTINVER.GestorAltas.Web.Public.Services;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Moq;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Public.FunctionalTests.Controllers
{
    public class ExtranjeroControllerTests: BaseTest
    {
        private ExtranjeroController extranjeroController { get; }

        public ExtranjeroControllerTests() {

            var productService = new ProductService(ApiWebPrivadaHelper);
            var signUpService = new SignUpService(ApiWebPrivadaHelper);
            var sendMailService = new SendMailService(ApiWebPrivadaHelper);
            var applicantService = new ApplicantService(ApiWebPrivadaHelper);
            var requestStoreStateContext = new RequestStoreStateContext<RequestValidation>();
            var requestStateFactory = new RequestStateFactory(Mapper, requestStoreStateContext);
            var requestService = new RequestService(ApiWebPrivadaHelper, requestStateFactory);
            var telemetryClient = new TelemetryClient();
            var testService = new TestService(ApiWebPrivadaHelper);
            var prospectService = new ProspectService(ApiWebPrivadaHelper);
            var customersService = new CustomersService(ApiWebPrivadaHelper);
            var alertService = new AlertService(ApiWebPrivadaHelper, requestService, Mapper);
            var signaturesService = new SignaturesService(ApiWebPrivadaHelper);
            var amlService = new AmlService(ApiWebPrivadaHelper);
            var sharedService = new SharedService(ApiWebPrivadaHelper);
            var representativesService = new RepresentativesService(ApiWebPrivadaHelper);
            var registerService = new RegisterService(applicantService, signUpService, AppSettings.Value, customersService, alertService, requestService, testService, Mapper, signaturesService, sendMailService, signUpService, amlService, productService, sharedService, representativesService, ConfigureLogger<RegisterService>());
            var operarionService = new OperationsService(ApiWebPrivadaHelper);
            var callLimitingServiceMock = new Mock<ICallLimitingService>();


            this.extranjeroController = new ExtranjeroController(productService, AppSettings, registerService, signUpService, Mapper, sendMailService, applicantService, requestService, testService, ConfigureLogger<ExtranjeroController>(), prospectService, callLimitingServiceMock.Object);
            this.extranjeroController.ControllerContext.HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null");
            this.extranjeroController.TempData = Mock.Of<ITempDataDictionary>();
            this.extranjeroController.Url =  new UrlHelper(new ActionContext() { HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null"), ActionDescriptor = new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor(), RouteData = new Microsoft.AspNetCore.Routing.RouteData() });
        }

        [Fact]
        public async Task IndexTest() {

            // Arrange
            var id = "1";
            var modal = "N";

            // Act
            var result = await this.extranjeroController.Index(id, modal);
            var viewResult = result as ViewResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
        }

        [Fact]
        public async Task IndexWithoutIdTest()
        {

            // Arrange
            var id = string.Empty;
            var modal = "N";

            // Act
            var result = await this.extranjeroController.Index(id, modal);
            var viewResult = result as ViewResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
        }

        [Fact]
        public async Task PersonalDataViewTest()
        {

            // Arrange
            var productId = 25;
            var id = $"?ProductId={productId}";
            var bytes = Encoding.UTF8.GetBytes(id);
            var base64 = Convert.ToBase64String(bytes);
            var modal = "N";

            // Act
            var result = await this.extranjeroController.PersonalDataView(base64, modal);
            var viewResult = result as ViewResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
        }

        [Fact]
        public async Task PersonalDataViewWithoutIdTest()
        {

            // Arrange
            var id = string.Empty;
            var modal = "N";

            // Act
            var result = await this.extranjeroController.PersonalDataView(id, modal);
            var viewResult = result as ViewResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
        }

        [Fact]
        public async Task RecoverySignatureTest()
        {

            // Arrange
            var dni = "Z8077883N";
            var requestId = "E7BFC1A9-8FF2-4D5A-AAF4-A6E7C4E8BA92";
            var id = $"?dni={dni}&requestId={requestId}";
            var bytes = Encoding.UTF8.GetBytes(id);
            var base64 = Convert.ToBase64String(bytes);

            // Act
            var result = await this.extranjeroController.RecoverySignature(base64);
            var viewResult = result as ViewResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
        }

        [Fact]
        public async Task SaveDniDataTest()
        {

            // Arrange
            var model = new Web.Models.Applicants.DNIData() {
                RequestId = Guid.Parse("E7BFC1A9-8FF2-4D5A-AAF4-A6E7C4E8BA92"),
                IdSendingWay = 2
            };

            // Act
            var result = await this.extranjeroController.SaveDniData(model);
            var okObjectResult = result as OkObjectResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.True((bool)okObjectResult.Value);
        }

        [Fact]
        public async Task SaveDniData2Test()
        {

            // Arrange
            var model = new Web.Models.Applicants.DNIData()
            {
                RequestId = Guid.Parse("E7BFC1A9-8FF2-4D5A-AAF4-A6E7C4E8BA92"),
                IdSendingWay = 1,
                DNI = "Z8077883N"
            };

            // Act
            var result = await this.extranjeroController.SaveDniData(model);
            var okObjectResult = result as OkObjectResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.True((bool)okObjectResult.Value);
        }
    }
}
