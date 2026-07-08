using System.Net;
using BESTINVER.GestorAltas.Web.Management.Controllers;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.Options;
using Moq;

namespace BESTINVER.GestorAltas.Web.Management.UnitTests.Controllers
{
    public class HomeControllerTests : BaseTest
    {
        private HomeController HomeController { get; }

        public HomeControllerTests()
        {
            var mockRequestLocalizationOptions = new Mock<RequestLocalizationOptions>();

            HomeController = new HomeController(Options.Create(mockRequestLocalizationOptions.Object))
            {
                ControllerContext = new ControllerContext() { HttpContext = GetHttpContextAccessor().HttpContext ?? throw new InvalidOperationException("HttpContext is null") },
                Url = new UrlHelper(new ActionContext() { HttpContext = HttpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is null"), ActionDescriptor = new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor(), RouteData = new Microsoft.AspNetCore.Routing.RouteData() })
            };
        }

        [Fact]
        public void LogoutTest()
        {

            // Act
            var result = HomeController.Logout();
            var redirect = result as RedirectToActionResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(redirect);
            Assert.NotNull(redirect.ActionName);
        }

        [Fact]
        public void IndexTest()
        {

            // Act
            var result = HomeController.Index();

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(((ViewResult)result).ViewData);
        }

        [Fact]
        public void SetLanguageTest()
        {
            // Arrange
            var model = new LanguageModel() { Culture = "es-ES", ReturnUrl = "https://bestinver-microservices-dev.azurewebsites.net/" };

            // Act
            var result = HomeController.SetLanguage(model);
            var objectResult = result as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(objectResult);
            Assert.Equal((int)HttpStatusCode.OK, objectResult.StatusCode);
        }

        [Fact]
        public void ErrorTest()
        {

            // Act
            var result = HomeController.Error();

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(((ViewResult)result).ViewData);
        }
    }
}