using System.Net;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.Controllers;
using BESTINVER.GestorAltas.Web.Management.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.ControllersV2
{
    public class TemplateMaintenanceCommunicationsControllerTests : BaseTest
    {
        private TemplateMaintenanceCommunicationsController templateMaintenanceCommunicationsController { get; }

        public TemplateMaintenanceCommunicationsControllerTests() {

            var templateMaintenanceCommunicationsService = new TemplateMaintenanceCommunicationsService(ApiWebPrivadaHelper);
            var communicationsService = new CommunicationsService(ApiWebPrivadaHelper);

            this.templateMaintenanceCommunicationsController = new TemplateMaintenanceCommunicationsController(templateMaintenanceCommunicationsService, communicationsService, Mapper, ConfigureLogger<TemplateMaintenanceController>());
            this.templateMaintenanceCommunicationsController.ControllerContext.HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null");
        }

        [Fact]
        public async Task IndexTest() {

            // Arrange
            var templateName = "Modelo 12_Ecualizacion_ESP.PDF";
            var productId = 25;

            // Act
            var result = await this.templateMaintenanceCommunicationsController.Index(templateName, productId);
            var viewResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.Model);
        }

        [Fact]
        public async Task GetTemplatesTest()
        {

            // Arrange
            var productId = "25";
            var productName = "BESTINVER INFRA FCR";

            // Act
            var result = await this.templateMaintenanceCommunicationsController.GetTemplates(productId, productName);
            var okObjResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjResult);
            Assert.NotNull(okObjResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjResult.StatusCode);
        }

        //[Fact]
        internal async Task GetTemplateFieldsTest()
        {

            // Arrange
            var templateName = "Modelo 12_Ecualizacion_ESP.PDF";
            var productName = "BESTINVER INFRA FCR";

            // Act
            var result = await this.templateMaintenanceCommunicationsController.GetTemplateFields(templateName, productName);
            var okObjResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjResult);
            Assert.NotNull(okObjResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjResult.StatusCode);
        }

        //[Fact]
        internal async Task UploadTemplateTest()
        {

            // Arrange
            var files = new TemplateMaintenanceCommunicationsViewModel();

            // Act
            var result = await this.templateMaintenanceCommunicationsController.UploadTemplate(files);
            var okObjResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjResult);
            Assert.NotNull(okObjResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjResult.StatusCode);
        }
    }
}
