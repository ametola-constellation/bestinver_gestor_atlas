using BestInver.WebPrivada.Shared.Models.Microservices.Operations;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.FunctionalTests.Builders;
using SimpleInjector.Lifestyles;
using System.Threading.Tasks;
using Xunit;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.Services
{
    public class OperationServiceTest : IClassFixture<DependenciesBuilder>
    {
        private readonly DependenciesBuilder dependenciesBuilder;

        public OperationServiceTest(DependenciesBuilder dependenciesBuilder)
        {
            this.dependenciesBuilder = dependenciesBuilder.WithContainer().WithDependencies();
        }


        [Fact]
        public async Task GetFundsData_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IOperationsService>();

                var search = new PaginatedSearch<FundSearch>();
                search.Limit = 20;
                search.Offset = 0;
                search.Search.FundName = "ING";
                search.Search.ProductType = new BestInver.WebPrivada.Shared.Models.Microservices.Products.ProductType
                {
                    Id = "FI"
                };
                
                var result = await service.SearchAutocomplete(search);
                Assert.True(result != null);
            }
        }


        [Fact]
        public async Task GetFundDetail_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IOperationsService>();

                string fundId = "19974";
                string fundType = "FI";

                var result = await service.FundDetail(fundId, fundType);
                Assert.True(result != null);
            }
        }
    }
}
