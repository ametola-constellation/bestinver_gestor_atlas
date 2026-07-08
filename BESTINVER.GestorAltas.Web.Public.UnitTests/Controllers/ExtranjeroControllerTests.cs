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
    public class ExtranjeroControllerTests : BaseTest
    {
        private ExtranjeroController ExtranjeroController { get; }

        public ExtranjeroControllerTests()
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
            var callLimitingServiceMock = new Mock<ICallLimitingService>();

            this.ExtranjeroController = new ExtranjeroController(productService, AppSettings, registerService, signUpService, Mapper, sendMailService, applicantService, requestService, testService, ConfigureLogger<ExtranjeroController>(), prospectService, callLimitingServiceMock.Object);
            this.ExtranjeroController.ControllerContext.HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null");
            this.ExtranjeroController.TempData = Mock.Of<ITempDataDictionary>();
            this.ExtranjeroController.Url = new UrlHelper(new ActionContext() { HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null"), ActionDescriptor = new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor(), RouteData = new Microsoft.AspNetCore.Routing.RouteData() });
        }

        
        [Fact]
        public async Task RecoverySignatureWithoutIdTest()
        {

            // Arrange
            var id = string.Empty;

            // Act
            var result = await this.ExtranjeroController.RecoverySignature(id);
            var redirectToActionResult = result as RedirectToActionResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(redirectToActionResult);
        }

        [Fact]
        public async Task SaveDniDataBadRequestTest()
        {
            //Arrange
            this.ExtranjeroController.ModelState.AddModelError("SessionName", "Required");

            // Act
            var result = await this.ExtranjeroController.SaveDniData(null);
            var badRequestResult = result as BadRequestResult;

            // Assert 
            Assert.NotNull(result);
            Assert.NotNull(badRequestResult);
        }
    }
}
