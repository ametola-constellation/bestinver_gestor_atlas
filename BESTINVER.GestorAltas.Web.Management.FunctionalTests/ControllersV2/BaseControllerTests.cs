using BESTINVER.GestorAltas.Web.Management.Controllers;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.ControllersV2
{
    public class BaseControllerTests : BaseTest
    {
        private LogActionController logActionController { get; set; }

        public BaseControllerTests()
        {
            this.logActionController = new LogActionController();
            if (HttpContextAccessor.HttpContext != null)
            {
                logActionController.ControllerContext.HttpContext = HttpContextAccessor.HttpContext;
            }
            else
            {
                throw new InvalidOperationException("HttpContext is null");
            }
        }

        //[Fact]
        public void GetPublicUrlDownloadDocumentTest()
        {
            // Arrange
            var urls = new List<Object>
            {
                "https://api.otpsecure.net/signed/H1Fn7X7Ib/2"
            };
            var aes256Key = "12345678901234567890123456789012";

            // Act
            var result = this.logActionController.GetPublicUrlDownloadDocument(urls, aes256Key);

            // Assert
            Assert.NotNull(result);
            Assert.NotEmpty(result);
        }

        //[Fact]
        public void GetPublicUrlDownloadDocumentStringTest()
        {
            // Arrange
            var aes256Key = "12345678901234567890123456789012";

            // Act
            var result = this.logActionController.GetPublicUrlDownloadDocument("https://api.otpsecure.net/signed/H1Fn7X7Ib/2", aes256Key);

            // Assert
            Assert.NotNull(result);
            Assert.NotEmpty(result);
        }
    }
}
