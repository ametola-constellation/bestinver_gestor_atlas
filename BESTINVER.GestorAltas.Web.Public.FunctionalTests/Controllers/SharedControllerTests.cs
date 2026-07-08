using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Public.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace BESTINVER.GestorAltas.Web.Public.FunctionalTests.Controllers
{
    public class SharedControllerTests : BaseTest
    {
        private SharedController sharedController { get; }

        public SharedControllerTests()
        {

            var sharedService = new SharedService(ApiWebPrivadaHelper);

            this.sharedController = new SharedController(sharedService);
        }

        [Fact]
        public async Task OpenFileTest()
        {
            // Arrange
            var urlBase64 = "aHR0cHM6Ly9kZXYtYmVzdGludmVyLWRvY3VzaWduLnNhbG1vbmRlc2VydC0yNDliY2E3Yi5ub3J0aGV1cm9wZS5henVyZWNvbnRhaW5lcmFwcHMuaW8vYXBpL3JlcXVlc3REb2N1bWVudHMvZ2V0RG9jLzViODE3ZDIxLWM0NDAtNGNjZC1hOTJhLTA0YWMxN2NiMjAzYi8wNTM5ODQ5N1kvMDA3X1Jlc3VsdGFkbyBDb252ZW5pZW5jaWEgUHJvZENvbXBsZWpvLnBkZg==";

            // Act
            var result = await this.sharedController.OpenFile(urlBase64, string.Empty);
            var fileContentResult = result as FileContentResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(fileContentResult);
        }
    }
}
