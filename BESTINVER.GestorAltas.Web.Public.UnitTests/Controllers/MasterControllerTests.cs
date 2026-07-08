using System.Net;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Public.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Moq;

namespace BESTINVER.GestorAltas.Web.Public.UnitTests.Controllers
{
    public class MasterControllerTests : BaseTest
    {
        private MasterController MasterController { get; }

        public MasterControllerTests()
        {

            var signUpService = new SignUpService(ApiWebPrivadaHelper);
            var testService = new TestService(ApiWebPrivadaHelper);
            var operationsService = new OperationsService(ApiWebPrivadaHelper);

            this.MasterController = new MasterController(signUpService, testService, Mapper, operationsService, ConfigureLogger<MasterController>());
            this.MasterController.ControllerContext.HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null");
            this.MasterController.TempData = Mock.Of<ITempDataDictionary>();
        }

        [Fact]
        public async Task GetAllQuestionsBadRequestTest()
        {
            //Arrange
            this.MasterController.ModelState.AddModelError("SessionName", "Required");


            // Act
            var result = await this.MasterController.GetAllQuestions();
            var badRequestObjectResult = result as BadRequestObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(badRequestObjectResult);
            Assert.NotNull(badRequestObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.BadRequest, badRequestObjectResult.StatusCode);

        }

        [Fact]
        public async Task GetQuestionsByProductBadRequestTest()
        {
            //Arrange
            var product = 25;
            this.MasterController.ModelState.AddModelError("SessionName", "Required");


            // Act
            var result = await this.MasterController.GetQuestionsByProduct(product);
            var badRequestObjectResult = result as BadRequestObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(badRequestObjectResult);
            Assert.NotNull(badRequestObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.BadRequest, badRequestObjectResult.StatusCode);

        }

        [Fact]
        public async Task FundsDataTest()
        {
            //Arrange
            var letters = string.Empty;
            var idProductType = 2;


            // Act
            var result = await this.MasterController.FundsData(letters, idProductType);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);

        }

        [Fact]
        public async Task FundsDataTestBadRequestTest()
        {
            //Arrange
            this.MasterController.ModelState.AddModelError("SessionName", "Required");
            var letters = string.Empty;
            var idProductType = 2;


            // Act
            var result = await this.MasterController.FundsData(letters, idProductType);
            var badRequestObjectResult = result as BadRequestObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(badRequestObjectResult);
            Assert.NotNull(badRequestObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.BadRequest, badRequestObjectResult.StatusCode);

        }

        [Fact]
        public async Task FundDetailBadRequestTest()
        {
            //Arrange
            this.MasterController.ModelState.AddModelError("SessionName", "Required");
            var fundId = "0";
            var fundType = 0;


            // Act
            var result = await this.MasterController.FundDetail(fundId, fundType);
            var badRequestObjectResult = result as BadRequestObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(badRequestObjectResult);
            Assert.NotNull(badRequestObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.BadRequest, badRequestObjectResult.StatusCode);

        }

        [Fact]
        public async Task PlansDataTest()
        {
            //Arrange
            var letters = string.Empty;


            // Act
            var result = await this.MasterController.PlansData(letters);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);

        }

        [Fact]
        public async Task PlansDataBadRequestTest()
        {
            //Arrange
            this.MasterController.ModelState.AddModelError("SessionName", "Required");
            var letters = string.Empty;


            // Act
            var result = await this.MasterController.PlansData(letters);
            var badRequestObjectResult = result as BadRequestObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(badRequestObjectResult);
            Assert.NotNull(badRequestObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.BadRequest, badRequestObjectResult.StatusCode);

        }

        [Fact]
        public async Task IsinDataTest()
        {
            //Arrange
            var letters = string.Empty;


            // Act
            var result = await this.MasterController.IsinData(letters);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);

        }

        [Fact]
        public async Task IsinDataBadRequestTest()
        {
            //Arrange
            this.MasterController.ModelState.AddModelError("SessionName", "Required");
            var letters = string.Empty;


            // Act
            var result = await this.MasterController.IsinData(letters);
            var badRequestObjectResult = result as BadRequestObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(badRequestObjectResult);
            Assert.NotNull(badRequestObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.BadRequest, badRequestObjectResult.StatusCode);

        }

        [Fact]
        public async Task ComsDataTest()
        {
            //Arrange
            var letters = string.Empty;
            var isin = string.Empty;


            // Act
            var result = await this.MasterController.ComsData(letters, isin);
            var okObjectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(okObjectResult);
            Assert.NotNull(okObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.OK, okObjectResult.StatusCode);

        }

        [Fact]
        public async Task ComsDataBadRequestTest()
        {
            //Arrange
            this.MasterController.ModelState.AddModelError("SessionName", "Required");
            var letters = string.Empty;
            var isin = string.Empty;


            // Act
            var result = await this.MasterController.ComsData(letters, isin);
            var badRequestObjectResult = result as BadRequestObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(badRequestObjectResult);
            Assert.NotNull(badRequestObjectResult.Value);
            Assert.Equal((int)HttpStatusCode.BadRequest, badRequestObjectResult.StatusCode);

        }

        [Fact]
        public void ErrorTest()
        {

            // Act
            var result = this.MasterController.Error();
            var viewResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewData);

        }
    }
}
