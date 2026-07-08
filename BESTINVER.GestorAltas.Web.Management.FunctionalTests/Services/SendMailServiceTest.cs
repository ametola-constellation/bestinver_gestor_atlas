using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.FunctionalTests.Builders;
using SimpleInjector.Lifestyles;
using System;
using System.Threading.Tasks;
using Xunit;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.Services
{
    public class SendMailServiceTest :  IClassFixture<DependenciesBuilder>
    {
        private readonly DependenciesBuilder dependenciesBuilder;

        public SendMailServiceTest(DependenciesBuilder dependenciesBuilder)
        {
            this.dependenciesBuilder = dependenciesBuilder.WithContainer().WithDependencies();
        }

        [Fact]
        public async Task SendNextStepMail_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<ISendMailService>();
                var result = await service.SendNextstepsMail(new Guid("6c1ece84-6650-4197-b60d-0e0a66e36bdc"), "77812705W");

                Assert.Null(result);
            }
        }
    }
}
