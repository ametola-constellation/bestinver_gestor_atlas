using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using BESTINVER.GestorAltas.Web.Public.Controllers;
using BESTINVER.GestorAltas.Web.Public.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Moq;

namespace BESTINVER.GestorAltas.Web.Public.UnitTests.Controllers
{
    public class JuridicaControllerTests : BaseTest
    {
        private JuridicaController JuridicaController { get; }

        public JuridicaControllerTests()
        {

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
            var sendMailService = new SendMailService(ApiWebPrivadaHelper);
            var amlService = new AmlService(ApiWebPrivadaHelper);
            var sharedService = new SharedService(ApiWebPrivadaHelper);
            var representativesService = new RepresentativesService(ApiWebPrivadaHelper);
            var prospectService = new ProspectService(ApiWebPrivadaHelper);


            var registerService = new RegisterService(applicantService, signUpService, AppSettings.Value, customersService, alertService, requestService, testService, Mapper, signaturesService, sendMailService, signUpService, amlService, productService, sharedService, representativesService, ConfigureLogger<RegisterService>());
            var callLimitingServiceMock = new Mock<ICallLimitingService>();

            this.JuridicaController = new JuridicaController(productService, AppSettings, registerService, signUpService, Mapper, sendMailService, applicantService, requestService, testService, ConfigureLogger<JuridicaController>(), prospectService, callLimitingServiceMock.Object);
            this.JuridicaController.ControllerContext.HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null");
            this.JuridicaController.ControllerContext.RouteData = new Microsoft.AspNetCore.Routing.RouteData();
            this.JuridicaController.TempData = Mock.Of<ITempDataDictionary>();
            this.JuridicaController.Url = new UrlHelper(new ActionContext() { HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null"), ActionDescriptor = new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor(), RouteData = new Microsoft.AspNetCore.Routing.RouteData() });
        }

        [Fact]
        public async Task SaveDniDataBadRequestTest()
        {
            //Arrange
            this.JuridicaController.ModelState.AddModelError("SessionName", "Required");

            // Act
            var result = await this.JuridicaController.SaveDniData(null);
            var badRequestResult = result as BadRequestResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(badRequestResult);
        }

        [Fact]
        public async Task RecoverySignatureWithoutIdTest()
        {
            //Arrange
            var id = "";

            // Act
            var result = await this.JuridicaController.RecoverySignature(id);
            var redirectToActionResult = result as RedirectToActionResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(redirectToActionResult);

        }

        [Fact]
        public async Task AskForRequiredRealOwnerTest()
        {
            //Arrange
            var model = new RequestRequiredRealOwner();

            // Act
            var result = await this.JuridicaController.AskForRequiredRealOwner(model);
            var okResult = result as OkObjectResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(okResult);
            Assert.NotNull(okResult.Value);

        }
    }
}
