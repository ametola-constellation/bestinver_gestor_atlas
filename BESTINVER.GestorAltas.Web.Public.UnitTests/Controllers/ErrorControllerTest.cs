using BESTINVER.GestorAltas.Web.Public.Controllers;
using BESTINVER.GestorAltas.Web.Public.Models;
using Microsoft.AspNetCore.Mvc;

namespace BESTINVER.GestorAltas.Web.Public.UnitTests.Controllers
{
    public class ErrorControllerTests
    {
        private ErrorController ErrorController { get; }

        public ErrorControllerTests()
        {
            this.ErrorController = new ErrorController();
        }

        [Fact]
        public void LogErrorTest()
        {

            // Arrange
            var error = new ErrorMessage();

            // Act
            var result = this.ErrorController.LogError(error);
            var jsonResult = result as JsonResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(jsonResult);
        }

        [Fact]
        public void LogDebugTest()
        {

            // Arrange
            var debug = new DebugMessage();

            // Act
            var result = this.ErrorController.LogDebug(debug);
            var jsonResult = result as JsonResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(jsonResult);
        }

        [Fact]
        public void InternalErrorTest()
        {
            // Act
            var result = this.ErrorController.InternalError();
            var viewResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
        }

        [Fact]
        public void NotFoundErrorTest()
        {
            // Act
            var result = this.ErrorController.NotFoundError();
            var viewResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
        }

        [Fact]
        public void SessionExpiredErrorTest()
        {
            // Act
            var result = this.ErrorController.SessionExpiredError();
            var viewResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
        }
    }
}
