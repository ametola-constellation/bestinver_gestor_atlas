using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using BESTINVER.GestorAltas.Web.Public.Controllers;
using BESTINVER.GestorAltas.Web.Public.Models.Register;
using BESTINVER.GestorAltas.Web.Public.Services;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Moq;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Public.FunctionalTests.Controllers
{
    public class JuridicaControllerTests: BaseTest
    {
        private JuridicaController juridicaController { get; }

        public JuridicaControllerTests() {

            var productService = new ProductService(ApiWebPrivadaHelper);
            var applicantService = new ApplicantService(ApiWebPrivadaHelper);
            var signUpService = new SignUpService(ApiWebPrivadaHelper);
            var customersService = new CustomersService(ApiWebPrivadaHelper);
            var requestStoreStateContext = new RequestStoreStateContext<RequestValidation>();
            var requestStateFactory = new RequestStateFactory(Mapper, requestStoreStateContext);
            var requestService = new RequestService(ApiWebPrivadaHelper, requestStateFactory);
            var alertService = new AlertService(ApiWebPrivadaHelper, requestService, Mapper);
            var testService = new TestService(ApiWebPrivadaHelper);
            var signaturesService = new SignaturesService(ApiWebPrivadaHelper);
            var sendMailService = new SendMailService (ApiWebPrivadaHelper);
            var amlService = new AmlService(ApiWebPrivadaHelper);
            var sharedService = new SharedService(ApiWebPrivadaHelper);
            var representativesService = new RepresentativesService(ApiWebPrivadaHelper);
            var telemetryClient = new TelemetryClient();
            var prospectService = new ProspectService(ApiWebPrivadaHelper);


            var registerService = new RegisterService(applicantService, signUpService, AppSettings.Value, customersService, alertService, requestService, testService, Mapper, signaturesService, sendMailService, signUpService, amlService, productService, sharedService, representativesService, ConfigureLogger<RegisterService>());
            var operarionService = new OperationsService(ApiWebPrivadaHelper);
            var callLimitingServiceMock = new Mock<ICallLimitingService>(); 

            this.juridicaController = new JuridicaController(productService, AppSettings, registerService, signUpService, Mapper, sendMailService, applicantService, requestService, testService, ConfigureLogger<JuridicaController>(), prospectService, callLimitingServiceMock.Object);
            this.juridicaController.ControllerContext.HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null");
            this.juridicaController.ControllerContext.RouteData = new Microsoft.AspNetCore.Routing.RouteData();
            this.juridicaController.TempData = Mock.Of<ITempDataDictionary>();
            this.juridicaController.Url = new UrlHelper(new ActionContext() { HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null"), ActionDescriptor = new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor(), RouteData = new Microsoft.AspNetCore.Routing.RouteData() });
        }

        [Fact]
        public async Task IndexTest()
        {

            // Arrange
            var id = "A9869DE7-DD81-4BBB-8CA5-19C14FD53D16";
            var modal = "N";

            // Act
            var result = await this.juridicaController.Index(id, modal);
            var redirectToActionResult = result as RedirectToActionResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(redirectToActionResult);
        }

        [Fact]
        public async Task IndexNumericTest() {
            
            // Arrange
            var id = "1";
            var modal = "N";

            // Act
            var result = await this.juridicaController.Index(id, modal);
            var viewResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewData);
        }

        [Fact]
        public async Task IndexWithoutIdTest()
        {

            // Arrange
            var id = string.Empty;
            var modal = "N";

            // Act
            var result = await this.juridicaController.Index(id, modal);
            var viewResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewData);
        }

        [Fact]
        public async Task PersonalDataViewTest()
        {

            // Arrange
            var productId = "25";
            var id = $"?ProductId={productId}";
            var bytes = Encoding.UTF8.GetBytes(id);
            var base64 = Convert.ToBase64String(bytes);
            var modal = "N";

            // Act
            var result = await this.juridicaController.PersonalDataView(base64, modal);
            var viewResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewData);
        }

        [Fact]
        public async Task PersonalDataViewExceptionTest()
        {

            // Arrange
            var id = "1";
            var modal = "N";

            // Act
            var result = await this.juridicaController.PersonalDataView(id, modal);
            var redirectToActionResult = result as RedirectToActionResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(redirectToActionResult);
        }

        [Fact]
        public async Task PersonalDataViewWithoutIdTest()
        {

            // Arrange
            var id = string.Empty;
            var modal = "N";

            // Act
            var result = await this.juridicaController.PersonalDataView(id, modal);
            var viewResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewData);
        }

        //[Fact]
        internal async Task SaveSignatureDataTest()
        {

            // Arrange
            var model = new DocumentGroupData() { RequestId =Guid.Parse("98DAD4C5-6895-4C76-8601-B054CDC88FD8") };

            // Act
            var result = await this.juridicaController.SaveSignatureData(model);
            var viewResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewData);
        }

        [Fact]
        public async Task SaveDniDataTest()
        {

            // Arrange
            var model = new Web.Models.Applicants.DNIData()
            {
                RequestId = Guid.Parse("E7BFC1A9-8FF2-4D5A-AAF4-A6E7C4E8BA92"),
                IdSendingWay = 2
            };

            // Act
            var result = await this.juridicaController.SaveDniData(model);
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
            var result = await this.juridicaController.SaveDniData(model);
            var okObjectResult = result as OkObjectResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.True((bool)okObjectResult.Value);
        }

        [Fact]
        public async Task RecoverySignatureTest()
        {
            //Arrange
            var dni = "Z8077883N";
            var requestId = "E7BFC1A9-8FF2-4D5A-AAF4-A6E7C4E8BA92";
            var id = $"?Dni={dni}&RequestId={requestId}";
            var bytes = Encoding.UTF8.GetBytes(id);
            var base64 = Convert.ToBase64String(bytes);
            

            // Act
            var result = await this.juridicaController.RecoverySignature(base64);
            var viewResult = result as ViewResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewData);
        }
    }
}
