using System.Net;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.Controllers;
using BESTINVER.GestorAltas.Web.Management.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.ControllersV2
{
    public class TemplateMaintenanceControllerTests : BaseTest
    {

        private TemplateMaintenanceController templateMaintenanceController { get; }

        public TemplateMaintenanceControllerTests() {

            var templateMaintenanceService = new TemplateMaintenanceService(ApiWebPrivadaHelper);

            this.templateMaintenanceController = new TemplateMaintenanceController(templateMaintenanceService, ConfigureLogger<TemplateMaintenanceController>());
        }

        [Fact]
        public async Task IndexTest() {

            // Arrange
            string templateName = "Acuerdo Suscripcion Inversion B Infra FCR.pdf";

            // Act 
            var result = await this.templateMaintenanceController.Index(templateName);
            var viewResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewData);
        }

        [Fact]
        public async Task DeleteTemplateTest()
        {

            // Arrange
            string templateName = "Acuerdo Suscripcion Inversion B Infra FCR.pdf";

            // Act 
            var result = await this.templateMaintenanceController.DeleteTemplate(templateName);
            var okObjResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjResult);
            Assert.Equal((int)HttpStatusCode.OK, okObjResult.StatusCode);
        }

        //[Fact]
        internal async Task UploadTemplateTest()
        {

            // Arrange
            var formFile = Mock.Of<IFormFile>();
            var files = new TemplateMaintenanceViewModel() { File = formFile  };

            // Act 
            var result = await this.templateMaintenanceController.UploadTemplate(files);

            // Assert
            Assert.NotNull(result);
        }

        //[Fact]
        internal async Task GetTemplateFieldsTest()
        {

            // Arrange
            string templateName = "Acuerdo Suscripcion Inversion B Infra FCR.pdf";

            // Act 
            var result = await this.templateMaintenanceController.GetTemplateFields(templateName);

            // Assert
            Assert.NotNull(result);
        }

    }
}
