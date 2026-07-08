using System.Net;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace BESTINVER.GestorAltas.Web.Management.UnitTests.Controllers
{
    public class RemediacionControllerTests : BaseTest
    {
        private RemediacionController RemediacionController { get; }

        public RemediacionControllerTests()
        {
            var sharedService = new SharedService(ApiWebPrivadaHelper);
            var remediationService = new RemediationService(ApiWebPrivadaHelper, sharedService);
            this.RemediacionController = new RemediacionController(remediationService, Mapper);
            this.RemediacionController.ControllerContext.HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null");
        }

        [Fact]
        public void IndexTest()
        {

            // Act
            var result = this.RemediacionController.Index();
            var viewResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
        }

        [Fact]
        public async Task CheckRequestStatusTest()
        {
            // Arrange
            string idClient = string.Empty;
            bool changeLog = false;

            // Act
            var result = await this.RemediacionController.CheckRequestStatus(idClient, changeLog);
            var actionResult = result as NoContentResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(actionResult);
            Assert.Equal((int)HttpStatusCode.NoContent, actionResult.StatusCode);
        }

        [Fact]
        public async Task UpdateUrlsTest()
        {
            // Act
            var result = await this.RemediacionController.UpdateUrls();
            var jsonResult = result as JsonResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(jsonResult);
            Assert.NotNull(jsonResult.Value);
        }
    }
}
