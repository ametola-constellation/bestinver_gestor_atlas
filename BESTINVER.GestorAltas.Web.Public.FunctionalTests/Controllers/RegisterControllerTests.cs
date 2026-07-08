using BESTINVER.GestorAltas.MicroservicesProxy.Models;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using BESTINVER.GestorAltas.Web.Models;
using BESTINVER.GestorAltas.Web.Public.Controllers;
using BESTINVER.GestorAltas.Web.Public.Models;
using BESTINVER.GestorAltas.Web.Public.Models.Register;
using BESTINVER.GestorAltas.Web.Public.Services;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Moq;
using System.Net;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Public.FunctionalTests.Controllers
{
    public class RegisterControllerTests : BaseTest
    {
        private RegisterController registerController { get; }

        public RegisterControllerTests() {

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
            var rateLimitingServiceMock = new Mock<ICallLimitingService>();

            this.registerController = new RegisterController(productService, AppSettings, registerService, signUpService, Mapper, sendMailService, applicantService, requestService,testService, ConfigureLogger<RegisterController>(), prospectService, rateLimitingServiceMock.Object);
            this.registerController.ControllerContext.HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null");
            this.registerController.ControllerContext.RouteData = new Microsoft.AspNetCore.Routing.RouteData();
            this.registerController.TempData = Mock.Of<ITempDataDictionary>();
            this.registerController.Url = new UrlHelper(new ActionContext() { HttpContext = this.HttpContextAccessor.HttpContext, ActionDescriptor = new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor(), RouteData = new Microsoft.AspNetCore.Routing.RouteData() });
        }

        [Fact]
        public async Task IndexEmptyTest()
        {
            //Arrange
            var id = string.Empty;
            var modal = string.Empty;

            // Act
            var result = await this.registerController.Index(id, modal);
            var viewResult = result as ViewResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewData);
        }

        [Fact]
        public async Task IndexTest()
        {
            //Arrange
            var id = "1";
            var modal = string.Empty;

            // Act
            var result = await this.registerController.Index(id, modal);
            var viewResult = result as ViewResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewData);
        }

        [Fact]
        public async Task IndexNotNumericTest()
        {
            //Arrange
            var id = "A";
            var modal = string.Empty;

            // Act
            var result = await this.registerController.Index(id, modal);
            var redirectToActionResult = result as RedirectToActionResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(redirectToActionResult);
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
            var result = await this.registerController.PersonalDataView(base64, modal);
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
            var result = await this.registerController.PersonalDataView(id, modal);
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
            var result = await this.registerController.PersonalDataView(id, modal);
            var viewResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewData);
        }

        //[Fact]
        internal async Task SaveApplicantBasicDataTest()
        {

            // Arrange
            var model = new ApplicantBasicData() { RequestId = Guid.Parse("A9869DE7-DD81-4BBB-8CA5-19C14FD53D16") };

            // Act
            var result = await this.registerController.SaveApplicantBasicData(model);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }

        //[Fact]
        internal async Task SaveRequestDataTest()
        {

            // Arrange
            var model = new RegisterData() { Applicants = [], OperationData = [new() { Operations = [] }], requestID = Guid.Parse("E7BFC1A9-8FF2-4D5A-AAF4-A6E7C4E8BA92") };

            // Act
            var result = await this.registerController.SaveRequestData(model);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }

        //[Fact]
        internal async Task SaveSignatureDataTest()
        {

            // Arrange
            var model = new DocumentGroupData() { RequestId = Guid.Parse("E7BFC1A9-8FF2-4D5A-AAF4-A6E7C4E8BA92") };

            // Act
            var result = await this.registerController.SaveSignatureData(model);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }

        [Fact]
        public async Task SaveDniDataTest()
        {

            // Arrange
            var model = new Web.Models.Applicants.DNIData()
            {
                RequestId = Guid.Parse("E7BFC1A9-8FF2-4D5A-AAF4-A6E7C4E8BA92"),
                IdSendingWay = 1,
                DNI = "Z8077883N"
            };

            // Act
            var result = await this.registerController.SaveDniData(model);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }

        [Fact]
        public async Task CompleteProcessTest()
        {
            //Arrange
            var model = new CompleteProcessModel() { RequestId = "E7BFC1A9-8FF2-4D5A-AAF4-A6E7C4E8BA92" };

            // Act
            var result = await this.registerController.CompleteProcess(model);
            var okObjectResult = result as OkObjectResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
        }

        [Fact]
        public async Task MoveToNextStatusTest()
        {
            //Arrange
            var model = new ChangeRequestStatusModel() { RequestId = Guid.Parse("E7BFC1A9-8FF2-4D5A-AAF4-A6E7C4E8BA92") };

            // Act
            var result = await this.registerController.MoveToNextStatus(model);
            var okObjectResult = result as OkObjectResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
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
            var result = await this.registerController.RecoverySignature(base64);
            var viewResult = result as ViewResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewData);
        }

        [Fact]
        public async Task SendDocumentTest()
        {
            //Arrange
            var dni = "Z8482724F";
            var requestId = "4C7D097E-7EE6-4787-B439-4B10652218BD";
            var completeName = "nuevoq coti";
            var birthday = "2000-01-01";
            var minor = false;
            var queryString = $"?Dni={dni}&RequestId={requestId}&CompleteName={completeName}&Birthday={birthday}&Minor={minor}";
            var bytes = Encoding.UTF8.GetBytes(queryString);
            var base64 = Convert.ToBase64String(bytes);

            // Act
            var result = await this.registerController.SendDocument(base64);
            var viewResult = result as ViewResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewData);

        }

        //[Fact]
        internal async Task RestoreSignatureProcessTest()
        {
            //Arrange
            var model = new SignatureRestoreDataViewModel()
            {
                RequestId = "765C05F2-58A0-4896-B8F5-A441573335EE",
                Dni = "20114447G"
            };

            // Act
            var result = await this.registerController.RestoreSignatureProcess(model);
            var okObjectResult = result as OkObjectResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);

        }

        //[Fact]
        internal async Task SendDocumentProcessTest()
        {
            //Arrange
            var model = new SignatureRestoreDataViewModel()
            {
                RequestId = "765C05F2-58A0-4896-B8F5-A441573335EE",
                Dni = "20114447G"
            };

            // Act
            var result = await this.registerController.SendDocumentProcess(model);
            var okObjectResult = result as OkObjectResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);

        }

        [Fact]
        public async Task CheckConvenienceTest()
        {
            //Arrange
            var model = new CheckConvenienceData() { Answers = [], ProductId = 1 };

            // Act
            var result = await this.registerController.CheckConvenience(model);
            var okObjectResult = result as OkObjectResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);

        }

        [Fact]
        public async Task SendHelpMailTest()
        {
            //Arrange
            var phone = "666666666";

            // Act
            var result = await this.registerController.SendHelpMail(phone);
            var okObjectResult = result as OkObjectResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);

        }

        [Fact]
        public async Task LegalModalContentTest()
        {
            // Act
            var result = await this.registerController.LegalModalContent();
            var okObjectResult = result as OkObjectResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);

        }

    }
}
