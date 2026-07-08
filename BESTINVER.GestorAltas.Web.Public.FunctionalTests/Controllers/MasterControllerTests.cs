using System.Net;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Public.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Moq;

namespace BESTINVER.GestorAltas.Web.Public.FunctionalTests.Controllers
{
    public class MasterControllerTests: BaseTest
    {
        private MasterController masterController { get; }

        public MasterControllerTests() {

            var signUpService = new SignUpService(ApiWebPrivadaHelper);
            var testService = new TestService(ApiWebPrivadaHelper);
            var operationsService = new OperationsService(ApiWebPrivadaHelper);

            this.masterController = new MasterController(signUpService, testService, Mapper, operationsService, ConfigureLogger<MasterController>());
            this.masterController.ControllerContext.HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null");
            this.masterController.TempData = Mock.Of<ITempDataDictionary>();
        }

        [Fact]
        public async Task GetOperationTypesTest() {

            // Arrange
            var productType = 2;
            var aplicantType = 0;

            // Act
            var result = await this.masterController.GetOperationTypes(productType, aplicantType);
            var okObjResut = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjResut);
            Assert.NotNull(okObjResut.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjResut.StatusCode);
        }

        [Fact]
        public async Task GetQuestionsTest()
        {

            // Arrange
            var requestApplicantType = 2;
            var aplicantType = 0;

            // Act
            var result = await this.masterController.GetQuestions(requestApplicantType, aplicantType);
            var okObjResut = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjResut);
            Assert.NotNull(okObjResut.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjResut.StatusCode);

        }

        [Fact]
        public async Task GetAllQuestionsTest()
        {

            // Act
            var result = await this.masterController.GetAllQuestions();
            var okObjResut = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjResut);
            Assert.NotNull(okObjResut.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjResut.StatusCode);

        }

        [Fact]
        public async Task GetQuestionsByProductTest()
        {
            //Arrange
            var product = 25;


            // Act
            var result = await this.masterController.GetQuestionsByProduct(product);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);

        }

        [Fact]
        public async Task FundDetailTest()
        {
            //Arrange
            var fundId ="60082";
            var fundType = 2;


            // Act
            var result = await this.masterController.FundDetail(fundId, fundType);
            var objectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(objectResult);
            Assert.NotNull(objectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, objectResult.StatusCode);

        }
    }
}
