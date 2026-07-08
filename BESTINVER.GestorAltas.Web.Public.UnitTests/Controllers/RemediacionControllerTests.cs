using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Public.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Moq;
using System.Net;

namespace BESTINVER.GestorAltas.Web.Public.UnitTests.Controllers
{
    public class RemediacionControllerTests : BaseTest
    {
        private RemediacionController RemediacionController { get; }

        public RemediacionControllerTests()
        {
            var sharedService = new SharedService(ApiWebPrivadaHelper);
            var remediacionService = new RemediationService(ApiWebPrivadaHelper, sharedService);
            var applicantService = new ApplicantService(ApiWebPrivadaHelper);
            var signUpService = new SignUpService(ApiWebPrivadaHelper);
            var signaturesService = new SignaturesService(ApiWebPrivadaHelper);
            var testService = new TestService(ApiWebPrivadaHelper);
            var sendMailService = new SendMailService(ApiWebPrivadaHelper);

            this.RemediacionController = new RemediacionController(remediacionService, applicantService, signUpService, Mapper, signaturesService, testService, sendMailService, AppSettings, ConfigureLogger<RemediacionController>());
            this.RemediacionController.ControllerContext.HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null");
            this.RemediacionController.TempData = Mock.Of<ITempDataDictionary>();
        }

        [Fact]
        public async Task IndexTest()
        {
            // Arrange
            var t = string.Empty;

            // Act
            var result = await this.RemediacionController.Index(t);
            var viewResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewData);
        }

        [Fact]
        public async Task AskForRequiredRealOwnerTest()
        {
            // Arrange
            var model = new RequestRequiredRealOwner();

            // Act
            var result = await this.RemediacionController.AskForRequiredRealOwner(model);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }
    }
}
