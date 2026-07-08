using BestInver.WebPrivada.Shared.Models.Middleware.Remediacion.Enums;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Public.Controllers;
using BESTINVER.GestorAltas.Web.Public.Models.Remediacion;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Moq;
using System.Net;

namespace BESTINVER.GestorAltas.Web.Public.FunctionalTests.Controllers
{
    public class RemediacionControllerTests : BaseTest
    {

        private RemediacionController remediacionController { get; }

        public RemediacionControllerTests()
        {
            var sharedService = new SharedService(ApiWebPrivadaHelper);
            var remediacionService = new RemediationService(ApiWebPrivadaHelper, sharedService);
            var applicantService = new ApplicantService(ApiWebPrivadaHelper);
            var signUpService = new SignUpService(ApiWebPrivadaHelper);
            var signaturesService = new SignaturesService(ApiWebPrivadaHelper);
            var testService = new TestService(ApiWebPrivadaHelper);
            var sendMailService = new SendMailService(ApiWebPrivadaHelper);

            this.remediacionController = new RemediacionController(remediacionService, applicantService, signUpService, Mapper, signaturesService, testService, sendMailService, AppSettings, ConfigureLogger<RemediacionController>());
            this.remediacionController.ControllerContext.HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null");
            this.remediacionController.TempData = Mock.Of<ITempDataDictionary>();
        }

        [Fact]
        public async Task PersonalDataTest()
        {
            // Arrange
            var model = new RemediacionPersonalDataModel()
            {
                RemediacionId = Guid.Parse("DBCF70F5-0287-4AC1-AF38-A23B86196754"),
                Birthday = new DateTime(1976, 9, 14),
                BornPlace = "vidal",
                Dni = "65837835J",
                RDTitular = "159166",
                Nacionality = 1,
                Country = 1
            };

            // Act
            var result = await this.remediacionController.PersonalData(model);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }

        [Fact]
        public async Task DniTest()
        {
            // Arrange
            var model = new RemediacionModel() { RemediacionId = "DBCF70F5-0287-4AC1-AF38-A23B86196754", Dni = new RemediacionDniModel() { IsPermanent = false, ExpirationYear = 2027, ExpirationMonth = 5, ExpirationDay = 30 } };

            // Act
            var result = await this.remediacionController.Dni(model);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }

        [Fact]
        public async Task DniPermanentTest()
        {
            // Arrange
            var model = new RemediacionModel() { RemediacionId = "DBCF70F5-0287-4AC1-AF38-A23B86196754", Dni = new RemediacionDniModel() { IsPermanent = true } };

            // Act
            var result = await this.remediacionController.Dni(model);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }

        //[Fact]
        internal async Task KnowledgeTestTest()
        {
            // Arrange
            var model = new RemediacionQuestionData()
            {
                RemediacionId = "DBCF70F5-0287-4AC1-AF38-A23B86196754",
                Answers = [],
                PersonalData = new RemediacionPersonalDataModel()
                {
                    Role = (int)TestTypeEnum.PersonaFísica,
                    SendType = 2
                },
                RemediacionChannel = (int)RemediacionChannelType.Telefonico,
                UpdateDocument = false
            };

            // Act
            var result = await this.remediacionController.KnowledgeTest(model);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }

        //[Fact]
        internal async Task KnowledgeTestJuridicaTest()
        {
            // Arrange
            var model = new RemediacionQuestionData()
            {
                RemediacionId = "DBCF70F5-0287-4AC1-AF38-A23B86196754",
                Answers = [],
                PersonalData = new RemediacionPersonalDataModel()
                {
                    Role = (int)TestTypeEnum.PersonaJurídica,
                    SendType = 2
                },
                RemediacionChannel = (int)RemediacionChannelType.Telefonico,
                UpdateDocument = false
            };

            // Act
            var result = await this.remediacionController.KnowledgeTest(model);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }

        //[Fact]
        internal async Task SignatureDataTest()
        {
            // Arrange
            var model = new RemediacionModel()
            {
                Signature = new RemediacionSignatureDataModel()
                {
                    Email = "test123@bestinver.es",
                    PhoneNumber = "+34666666666"
                },
                RemediacionId = "FB925BBB-B85F-4DD1-978C-03BCD4E61D39",
                ClientId = ""
            };

            // Act
            var result = await this.remediacionController.SignatureData(model);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }

        //[Fact]
        internal async Task SignatureDataEmptyTest()
        {
            // Arrange
            var model = new RemediacionModel()
            {
                Signature = null,
                RemediacionId = "FB925BBB-B85F-4DD1-978C-03BCD4E61D39",
                ClientId = "29265"
            };

            // Act
            var result = await this.remediacionController.SignatureData(model);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }

        //[Fact]
        internal async Task JuridicSignatureDataTest()
        {
            // Arrange
            var model = new JuridicRemediacionModel()
            {
                RemediacionId = "DBCF70F5-0287-4AC1-AF38-A23B86196754",
                RemediacionModelList = []
            };

            // Act
            var result = await this.remediacionController.JuridicSignatureData(model);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }

        [Fact]
        public async Task SetRemediationSignedTest()
        {
            // Arrange
            var requestId = Guid.Parse("FB925BBB-B85F-4DD1-978C-03BCD4E61D39");
            bool setpartialStatus = false;

            // Act
            var result = await this.remediacionController.SetRemediationSigned(requestId, setpartialStatus);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }

        [Fact]
        public async Task SetJuridicRemediationSignedTest()
        {
            // Arrange
            var requestId = Guid.Parse("FB925BBB-B85F-4DD1-978C-03BCD4E61D39");
            var applicantId = 29265;

            // Act
            var result = await this.remediacionController.SetJuridicRemediationSigned(requestId, applicantId);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }

        [Fact]
        public async Task CompleteProcessTest()
        {
            // Arrange
            var model = new RemediacionModel()
            {
                UpdateDocument = false,
                RemediacionId = "DBCF70F5-0287-4AC1-AF38-A23B86196754",
            };

            // Act
            var result = await this.remediacionController.CompleteProcess(model);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }

        //[Fact]
        internal async Task SendHelpMailTest()
        {
            // Arrange
            var phone = "666289429";

            // Act
            var result = await this.remediacionController.SendHelpMail(phone);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }

        [Fact]
        public async Task LegalModalContentTest()
        {
            // Act
            var result = await this.remediacionController.LegalModalContent();
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);
        }
    }
}
