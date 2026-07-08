using BESTINVER.GestorAltas.Web.Public.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Moq;

namespace BESTINVER.GestorAltas.Web.Public.UnitTests.Controllers
{
    public class HomeControllerTests : BaseTest
    {
        private HomeController HomeController { get; }

        public HomeControllerTests()
        {
            this.HomeController = new HomeController(AppSettings.Value);
            this.HomeController.ControllerContext.HttpContext = this.HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null");
            this.HomeController.TempData = Mock.Of<ITempDataDictionary>();
            this.HomeController.Url = new UrlHelper(new ActionContext() { HttpContext = this.HttpContextAccessor.HttpContext, ActionDescriptor = new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor(), RouteData = new Microsoft.AspNetCore.Routing.RouteData() });
        }

        [Fact]
        public void IndexTest()
        {
            // Arrange
            var id = "1";

            // Act
            var result = this.HomeController.Index(id);
            var actionResult = result as RedirectToActionResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(actionResult);
            Assert.NotNull(actionResult.ActionName);
            Assert.NotEmpty(actionResult.ActionName);
        }

        [Fact]
        public void ErrorTest()
        {

            // Act
            var result = this.HomeController.Error();
            var viewResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewData);
        }
    }
}
