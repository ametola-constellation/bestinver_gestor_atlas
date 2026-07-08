using BESTINVER.GestorAltas.Web.Management.FunctionalTests.Builders;
using BESTINVER.Wordpress.WS.Controllers;
using Microsoft.AspNetCore.Mvc;
using SimpleInjector.Lifestyles;
using System.Threading.Tasks;
using Xunit;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.Services
{
    public class ProductServiceTest : IClassFixture<DependenciesBuilder>
    {
        private readonly DependenciesBuilder dependenciesBuilder;

        public ProductServiceTest(DependenciesBuilder dependenciesBuilder)
        {
            this.dependenciesBuilder = dependenciesBuilder.WithContainer().WithDependencies();
        }

        [Fact]
        public async Task DownloadExcelLiquidityTest()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var controller = container.GetInstance<ProfitabilityController>();
                int productId = 13;

                var result = await controller.DownloadExcelLiquidity(productId);

                Assert.IsType<FileContentResult>(result);
            }
        }

        [Fact]
        public async Task MonthlyVLTest()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var controller = container.GetInstance<ProfitabilityController>();
                int productId = 13;
                string chartLegend = "qq";
                int countValues = 1;

                var result = await controller.MonthlyVL(productId, chartLegend, countValues);

                Assert.IsType<OkObjectResult>(result);
            }
        }

        [Fact]
        public async Task AnnualProfitabilityTest()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var controller = container.GetInstance<ProfitabilityController>();
                int productId = 13;
                string chartLegend = "qq";
                int countValues = 1;

                var result = await controller.AnnualProfitability(productId, chartLegend, countValues);

                Assert.IsType<OkObjectResult>(result);
            }
        }

        [Fact]
        public async Task MonthlyProfitabilityTest()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var controller = container.GetInstance<ProfitabilityController>();
                int productId = 13;
                string chartLegend = "qq";
                int countValues = 1;

                var result = await controller.MonthlyProfitability(productId, chartLegend, countValues) ;

                Assert.IsType<OkObjectResult>(result);
            }
        }

        [Fact]
        public async Task ProductResumenProfitabilityTest()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var controller = container.GetInstance<ProfitabilityController>();
                int productId = 13;
                string chartLegend = "qq";

                var result = await controller.ProductResumenProfitability(productId, chartLegend);

                Assert.IsType<OkObjectResult>(result);
            }
        }

        [Fact]
        public async Task AllLiquidityProfitabilityDateLastYearTest()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var controller = container.GetInstance<ProfitabilityController>();

                var result = await controller.AllLiquidityProfitabilityDateLastYear();

                Assert.IsType<OkObjectResult>(result);
            }
        }

        [Fact]
        public async Task CumulativeProfitabilityTest()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var controller = container.GetInstance<ProfitabilityController>();
                int productId = 13;

                var result = await controller.CumulativeProfitability(productId);

                Assert.IsType<OkObjectResult>(result);
            }
        }
    }
} 