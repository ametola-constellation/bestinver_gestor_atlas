using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using BESTINVER.GestorAltas.Web.Models;
using BESTINVER.GestorAltas.Web.Models.Applicants;
using BESTINVER.GestorAltas.Web.Public.Controllers;
using BESTINVER.GestorAltas.Web.Public.Models.Register;
using BESTINVER.GestorAltas.Web.Public.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Moq;
using System.Net;

namespace BESTINVER.GestorAltas.Web.Public.UnitTests.Controllers
{
    public class RegisterControllerTests : BaseTest
    {
        private RegisterController RegisterController { get; }

        public RegisterControllerTests()
        {

            var productService = new ProductService(ApiWebPrivadaHelper);
            var signUpService = new SignUpService(ApiWebPrivadaHelper);
            var sendMailService = new SendMailService(ApiWebPrivadaHelper);
            var applicantService = new ApplicantService(ApiWebPrivadaHelper);
            var requestStoreStateContext = new RequestStoreStateContext<RequestValidation>();
            var requestStateFactory = new RequestStateFactory(Mapper, requestStoreStateContext);
            var requestService = new RequestService(ApiWebPrivadaHelper, requestStateFactory);
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

            this.RegisterController = new RegisterController(productService, AppSettings, registerService, signUpService, Mapper, sendMailService, applicantService, requestService, testService, ConfigureLogger<RegisterController>(), prospectService, callLimitingServiceMock.Object);
            this.RegisterController.ControllerContext.HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null");
            this.RegisterController.ControllerContext.RouteData = new Microsoft.AspNetCore.Routing.RouteData();
            this.RegisterController.TempData = Mock.Of<ITempDataDictionary>();
            this.RegisterController.Url = new UrlHelper(new ActionContext() { HttpContext = this.HttpContextAccessor.HttpContext, ActionDescriptor = new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor(), RouteData = new Microsoft.AspNetCore.Routing.RouteData() });
        }

        [Fact]
        public void LoginTest()
        {
            //Arrange
            var id = "1";

            // Act
            var result = this.RegisterController.Login(id);
            var redirectToActionResult = result as RedirectToActionResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(redirectToActionResult);
        }

        [Fact]
        public async Task SaveApplicantBasicDataBadRequestTest()
        {

            // Arrange
            var model = new ApplicantBasicData();
            this.RegisterController.ModelState.AddModelError("SessionName", "Required");

            // Act
            var result = await this.RegisterController.SaveApplicantBasicData(model);
            var badRequestResult = result as BadRequestResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(badRequestResult);
            Assert.Equal((int)HttpStatusCode.BadRequest, badRequestResult.StatusCode);
        }

        [Fact]
        public async Task SaveSignatureDataBadRequestTest()
        {

            // Arrange
            var model = new DocumentGroupData();
            this.RegisterController.ModelState.AddModelError("SessionName", "Required");

            // Act
            var result = await this.RegisterController.SaveSignatureData(model);
            var badRequestResult = result as BadRequestResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(badRequestResult);
            Assert.Equal((int)HttpStatusCode.BadRequest, badRequestResult.StatusCode);
        }

        [Fact]
        public async Task SaveDniDataBadRequestTest()
        {

            // Arrange
            var model = new DNIData();
            this.RegisterController.ModelState.AddModelError("SessionName", "Required");

            // Act
            var result = await this.RegisterController.SaveDniData(model);
            var badRequestResult = result as BadRequestResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(badRequestResult);
            Assert.Equal((int)HttpStatusCode.BadRequest, badRequestResult.StatusCode);
        }

        [Fact]
        public async Task SetApplicantGDPRTest()
        {
            //Arrange
            var model = new GDPRApplicantAcceptationModel() { DNI = "Z8077883N" };

            // Act
            var result = await this.RegisterController.SetApplicantGDPR(model);
            var jsonResult = result as JsonResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(jsonResult);
        }

        [Fact]
        public async Task RecoverySignatureEmptyTest()
        {
            //Arrange
            var id = string.Empty;

            // Act
            var result = await this.RegisterController.RecoverySignature(id);
            var redirectToActionResult = result as RedirectToActionResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(redirectToActionResult);
        }

        [Fact]
        public async Task SendDocumentWithoutIdTest()
        {
            //Arrange
            var id = "";

            // Act
            var result = await this.RegisterController.SendDocument(id);
            var redirectToActionResult = result as RedirectToActionResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(redirectToActionResult);

        }

        [Fact]
        public async Task SetApplicantSignDateTest()
        {
            //Arrange
            var requestId = Guid.Parse("765C05F2-58A0-4896-B8F5-A441573335EE");
            var dni = "20114447G";

            // Act
            var result = await this.RegisterController.SetApplicantSignDate(requestId, dni);
            var okResult = result as OkResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(okResult);

        }

        [Fact]
        public async Task CheckConvenienceExistingApplicantTest()
        {
            //Arrange
            var productId = 1;
            var dni = "20114447G";

            // Act
            var result = await this.RegisterController.CheckConvenienceExistingApplicant(dni, productId);
            var okObjectResult = result as OkObjectResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);

        }

        [Fact]
        public async Task CheckConvenienceExistingApplicantBadRequestTest()
        {

            // Arrange
            var productId = 1;
            var dni = "20114447G";
            this.RegisterController.ModelState.AddModelError("SessionName", "Required");

            // Act
            var result = await this.RegisterController.CheckConvenienceExistingApplicant(dni, productId);
            var badRequestObjectResult = result as BadRequestObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(badRequestObjectResult);
            Assert.NotNull(badRequestObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.BadRequest, badRequestObjectResult.StatusCode);
        }

        [Fact]
        public void ErrorTest()
        {
            // Act
            var result = this.RegisterController.Error();
            var viewResult = result as ViewResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewData);

        }
    }
}
