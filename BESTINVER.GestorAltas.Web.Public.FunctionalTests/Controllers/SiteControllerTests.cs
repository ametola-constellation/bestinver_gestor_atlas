using BESTINVER.GestorAltas.Web.Public.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace BESTINVER.GestorAltas.Web.Public.FunctionalTests.Controllers
{
    public class SiteControllerTests : BaseTest
    {
        private SiteController siteController { get; }

        public SiteControllerTests() { 
            
            this.siteController = new SiteController();
        }

        //[Fact]
        public void DownloadTest() {

            // Arrange
            var id = string.Empty;

            // Act
            var result = this.siteController.Download(id);
            var fileContentResult = result as FileContentResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(fileContentResult);
        }

        //[Fact]
        public void DownloadBase64Test()
        {

            // Arrange
            var id = string.Empty;
            var base64 = true;

            // Act
            var result = this.siteController.Download(id, base64);
            var fileContentResult = result as FileContentResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(fileContentResult);
        }
    }
}
