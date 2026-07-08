using System.Net;
using AutoMapper;
using BESTINVER.GestorAltas.Domain;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.Controllers;
using BESTINVER.GestorAltas.Web.Management.Models.Remediacion;
using BESTINVER.GestorAltas.Web.Management.Profiles;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Mvc;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.ControllersV2
{
    public class RemediacionControllerTests : BaseTest
    {
        private RemediacionController remediacionController { get; }

        protected readonly IMapper mapper;

        public RemediacionControllerTests() {

            mapper = AutoMapperConfig.GetConfiguration([
                typeof(TableResultProfile).Assembly
            ]).CreateMapper();

            var sharedService = new SharedService(ApiWebPrivadaHelper);
            var remediationService = new RemediationService(ApiWebPrivadaHelper, sharedService);
            this.remediacionController = new RemediacionController(remediationService, Mapper);
            this.remediacionController.ControllerContext.HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null");
        }

        [Fact]
        public async Task CotitularNotRemediatedTest()
        {
            // Arrange
            string rdTitular = "57050";

            // Act
            var result = await this.remediacionController.CotitularNotRemediated(rdTitular);
            var partialViewResult = result as PartialViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(partialViewResult);
            Assert.NotNull(partialViewResult.ViewData);
        }

        [Fact]
        public async Task GetCotitularNotRemediatedByDNIClienteCodTest()
        {
            // Arrange
            string rdTitular = "57050";

            // Act
            var result = await this.remediacionController.GetCotitularNotRemediatedByDNIClienteCod(rdTitular);
            var actionResult = result as NoContentResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(actionResult);
            Assert.Equal((int)HttpStatusCode.NoContent, actionResult.StatusCode);
        }

        [Fact]
        public async Task UpdateSendTypeTest()
        {
            // Arrange
            var requestId = Guid.Parse("32BE5FB9-4A8D-466B-94C0-EE98FEE5FE5A");
            var type = SendTypeEnum.Mail;

            // Act
            var result = await this.remediacionController.UpdateSendType(requestId, type);
            var partialViewResult = result as PartialViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(partialViewResult);
            Assert.NotNull(partialViewResult.ViewData);
        }

        [Fact]
        public async Task SetRemediacionStatusTest()
        {
            // Arrange
            var requestId = Guid.Parse("32BE5FB9-4A8D-466B-94C0-EE98FEE5FE5A");
            var status = RequestStatusEnum.DocumentoActualizado;
            var description = string.Empty;

            // Act
            var result = await this.remediacionController.SetRemediacionStatus(requestId, status, description);
            var partialViewResult = result as PartialViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(partialViewResult);
            Assert.NotNull(partialViewResult.ViewData);
        }

        [Fact]
        public async Task UpdateRequestTypeTest()
        {
            // Arrange
            var requestId = Guid.Parse("32BE5FB9-4A8D-466B-94C0-EE98FEE5FE5A");
            var type = RequestTypeEnum.DNI;

            // Act
            var result = await this.remediacionController.UpdateRequestType(requestId, type);
            var partialViewResult = result as PartialViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(partialViewResult);
            Assert.NotNull(partialViewResult.ViewData);
        }

        [Fact]
        public async Task UpdateChannelTest()
        {
            // Arrange
            var requestId = Guid.Parse("32BE5FB9-4A8D-466B-94C0-EE98FEE5FE5A");
            var channel = RemediationChannelType.NoAplica;

            // Act
            var result = await this.remediacionController.UpdateChannel(requestId, channel);
            var partialViewResult = result as PartialViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(partialViewResult);
            Assert.NotNull(partialViewResult.ViewData);
        }

        [Fact]
        public async Task UpdateDniExpirationTest()
        {
            // Arrange
            var requestId = Guid.Parse("32BE5FB9-4A8D-466B-94C0-EE98FEE5FE5A");
            DateTime? date = null;
            bool? notExpiry = null;

            // Act
            var result = await this.remediacionController.UpdateDniExpiration(requestId, date, notExpiry);
            var partialViewResult = result as PartialViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(partialViewResult);
            Assert.NotNull(partialViewResult.ViewData);
        }

        [Fact]
        public async Task SetRemediationUserTest()
        {
            // Arrange
            var requestId = Guid.Parse("32BE5FB9-4A8D-466B-94C0-EE98FEE5FE5A");
           
            // Act
            var result = await this.remediacionController.SetRemediationUser(requestId);
            var jsonResult = result as JsonResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(jsonResult);
            Assert.NotNull(jsonResult.Value);
        }

        //[Fact]
        internal async Task FilterDigitalRequestsTest()
        {
            // Arrange
            var p = new JQueryDataTableParamModel();
            DateTime? from = new DateTime(2024,5,1);
            DateTime? to = null;
            var status = RequestStatusEnum.NoIniciado;
            DateTime? laststatusdate = DateTime.Now;

            // Act
            var result = await this.remediacionController.FilterDigitalRequests(p, from, to, status, laststatusdate);

            // Assert
            Assert.NotNull(result);
        }
    }
}
