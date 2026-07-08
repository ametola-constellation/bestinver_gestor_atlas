using BESTINVER.GestorAltas.Web.Public.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace BESTINVER.GestorAltas.Web.Public.UnitTests.Controllers
{
    public class LandingControllerTests : BaseTest
    {
        private LandingController LandingController { get; }

        public LandingControllerTests()
        {

            this.LandingController = new LandingController(ConfigureLogger<LandingController>());
        }

        [Fact]
        public void IndexTest()
        {

            // Act
            var result = this.LandingController.Index();
            var viewResult = result as ViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(viewResult);
            Assert.NotNull(viewResult.ViewName);
            Assert.NotEmpty(viewResult.ViewName);
        }
    }
}
