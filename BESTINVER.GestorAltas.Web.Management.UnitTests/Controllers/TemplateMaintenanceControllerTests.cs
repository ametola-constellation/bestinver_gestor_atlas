using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace BESTINVER.GestorAltas.Web.Management.UnitTests.Controllers
{
    public class TemplateMaintenanceControllerTests : BaseTest
    {
        private TemplateMaintenanceController TemplateMaintenanceController { get; }

        public TemplateMaintenanceControllerTests()
        {

            var templateMaintenanceService = new TemplateMaintenanceService(ApiWebPrivadaHelper);

            this.TemplateMaintenanceController = new TemplateMaintenanceController(templateMaintenanceService, ConfigureLogger<TemplateMaintenanceController>());
        }

        [Fact]
        public async Task FillTemplateTest()
        {

            // Arrange
            string templateName = "Acuerdo Suscripcion Inversion B Infra FCR.pdf";
            var data = new List<PdfFields>();

            // Act 
            var result = await this.TemplateMaintenanceController.FillTemplate(templateName, data);
            var statusCodeResult = result as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(statusCodeResult);
        }
    }
}
