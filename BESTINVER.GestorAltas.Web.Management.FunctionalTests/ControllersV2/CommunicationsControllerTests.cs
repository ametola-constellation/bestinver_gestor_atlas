using System.Net;
using BestInver.WebPrivada.Shared.Models.Microservices.Communications;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.Controllers;
using Microsoft.AspNetCore.Mvc;
using BESTINVER.GestorAltas.Web.Management.Models.Communications;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.ControllersV2
{
    public class CommunicationsControllerTests:BaseTest
    {
        public CommunicationsController communicationController { get; set; }

        public CommunicationsControllerTests() {
            var productService = new ProductService(this.ApiWebPrivadaHelper);
            var templateMaintenanceCommunicationsService = new TemplateMaintenanceCommunicationsService(this.ApiWebPrivadaHelper);
            var eventsTempaltesService = new EventsTemplatesService(this.ApiWebPrivadaHelper);
            var communicationsService = new CommunicationsService(this.ApiWebPrivadaHelper);
            this.communicationController = new CommunicationsController(productService, templateMaintenanceCommunicationsService, eventsTempaltesService, communicationsService, AppSettings);
        }

        [Fact]
        public async Task IndexTest()
        {

            // Arrange

            // Act
            var result = await this.communicationController.Index();
            var objResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(objResult?.Model);
        }

        [Fact]
        public async Task GetTemplatesCommunicationsTest()
        {

            // Arrange
            var productId = "25";
            var productName = "BESTINVER INFRA FCR";

            // Act
            var result = await this.communicationController.GetTemplatesCommunications(productId, productName);
            var objResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal((int)HttpStatusCode.OK, objResult?.StatusCode);
        }

        [Fact]
        public async Task GetEventsTemplateTest()
        {

            // Arrange
            var eventId = 11;

            // Act
            var result = await this.communicationController.GetEventsTemplate(eventId);
            var objResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal((int)HttpStatusCode.OK, objResult?.StatusCode);
        }

        [Fact]
        public async Task GetDistributorTest()
        {

            // Arrange

            // Act
            var result = await this.communicationController.GetDistributor();
            var objResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal((int)HttpStatusCode.OK, objResult?.StatusCode);
        }

        [Fact]
        public async Task GetAllClientsTest()
        {

            // Arrange
            var productId = 25;
            var templateId = 1;
            var eventId = 1;
            var nifNiePasaporte = string.Empty;
            var nameSurname = string.Empty;
            var marketerId = 0;
            var segment = string.Empty;

            // Act
            var result = await this.communicationController.GetAllClients(productId, templateId, eventId, nifNiePasaporte, nameSurname, marketerId, segment);
            var objResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal((int)HttpStatusCode.OK, objResult?.StatusCode);
            Assert.NotNull(objResult?.Value);
            Assert.NotEmpty((List<CommunicationClient>)objResult.Value);
        }

        [Fact]
        public async Task LoadDataTableTest()
        {

            // Arrange
            var eventIdSelected = 1;
            var eventList = new List<EventTemplate>();
            var limit = 20;
            var maxClientsToGenerate = 20;
            var marketerList = new List<Microsoft.AspNetCore.Mvc.Rendering.SelectListItem>();
            var marketerIdSelected = 1;
            var offset = 1;
            var nameSurname = string.Empty;
            var nifNiePasaporte = string.Empty;
            var orderBy = "1";
            var orderDir = Utilities.Enums.OrderDir.Asc;
            var productIdSelected = 25;
            var productList = new List<CommunicationProduct>();
            var products = new List<Microsoft.AspNetCore.Mvc.Rendering.SelectListItem>();
            var secho = string.Empty;
            var events = new List<Microsoft.AspNetCore.Mvc.Rendering.SelectListItem>();
            var segment = string.Empty;
            var templateIdSelected = 1;
            var templateList = new List<BestInver.WebPrivada.Shared.Models.Microservices.TemplateCommunications.TemplateCommunication>();
            var templates = new List<Microsoft.AspNetCore.Mvc.Rendering.SelectListItem>();
            var urlSharedFolder = string.Empty;
                        
            var model = new SearchModel()
            {
                EventIdSelected = eventIdSelected,
                EventList = eventList,
                Limit = limit,
                Marketer = marketerList,
                MarketerIdSelected = marketerIdSelected,
                MarketerList = marketerList,
                MaxClientsToGenerate = maxClientsToGenerate,
                NameSurname = nameSurname,
                NifNiePasaporte = nifNiePasaporte,
                Offset = offset,
                OrderBy = orderBy,
                OrderDir = orderDir,
                ProductIdSelected = productIdSelected,
                ProductList = productList,
                Products = products,
                SEcho = secho,
                Events = events,
                Segment = segment,
                TemplateIdSelected = templateIdSelected,
                TemplateList = templateList,
                Templates = templates,
                UrlSharedFolder = urlSharedFolder
            };
           

            // Act
            var result = await this.communicationController.LoadDataTable(model);
            var objResult = result as JsonResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(objResult);
        }
    }
}
