using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.FunctionalTests.Builders;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SimpleInjector.Lifestyles;
using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.Services
{
    [TestClass]
    public class SignUpService
    {
        private DependenciesBuilder dependenciesBuilder;

        [TestInitialize]
        public void Init()
        {
            this.dependenciesBuilder = new DependenciesBuilder().WithContainer().WithDependencies();
        }

        [TestMethod]
        public async Task AltaRD_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<ISignUpService>();
                const int operationId = 792;
                var requestID = new Guid("77ee25cc-24b4-45bd-83c9-08b59814ea4e");
                var operationDate = new Dictionary<int, DateTime>
                {
                    { operationId, DateTime.UtcNow }
                };

                var result = await service.SendToRD(requestID, operationDate).ConfigureAwait(false);
                Assert.IsTrue(result != null);
            }
        }
    }
}