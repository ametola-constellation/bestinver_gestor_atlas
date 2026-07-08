using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Portfolios;
using BestInver.WebPrivada.Shared.Models.Microservices.Products;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.Wordpress.WS.Controllers;
using BESTINVER.Wordpress.WS.Models;
using BESTINVER.Wordpress.WS.Tests.Builders;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using SimpleInjector.Lifestyles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Xunit;

[assembly: CollectionBehavior(MaxParallelThreads = 1)]
namespace BESTINVER.Wordpress.WS.Tests.Controllers
{
    public class ProfitabilityControllerTest : IClassFixture<DependenciesBuilder>
    {
        private readonly DependenciesBuilder dependenciesBuilder;
        private readonly Mock<IProductService> productService = new();
        private readonly Mock<ILogger<ProfitabilityController>> logger = new();

        public ProfitabilityControllerTest(DependenciesBuilder db)
        {
            this.dependenciesBuilder = db.WithContainer().WithDependencies();
        }

        [Fact]
        public async Task DownloadExcelLiquidity_test()
        {
            // arrange
            byte[] excelFile = new byte[155];
            var product = new Product
            {
                RDCode = 1,
                Name = "test"
            };

            productService.Setup(p => p.GetProductAssetExcel(It.IsAny<Int32>(), It.IsAny<Int32>())).ReturnsAsync(excelFile);
            productService.Setup(p => p.GetProduct(It.IsAny<Int32>())).ReturnsAsync(product);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object,
                    container.GetInstance<IConfiguration>());

                var result = (await sut.DownloadExcelLiquidity(1)) as FileContentResult;

                // assert
                Assert.NotNull(result);
            }
        }

        [Fact]
        public async Task DownloadExcelLiquidity_BadRequest_test()
        {
            // arrange
            byte[] excelFile = new byte[155];
            Product product = null;

            productService.Setup(p => p.GetProductAssetExcel(It.IsAny<Int32>(), It.IsAny<Int32>())).ReturnsAsync(excelFile);
            productService.Setup(p => p.GetProduct(It.IsAny<Int32>())).ReturnsAsync(product);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object,
                    container.GetInstance<IConfiguration>());

                var result = (await sut.DownloadExcelLiquidity(0)) as StatusCodeResult;

                // assert
                Assert.Equal((int)HttpStatusCode.Moved, result.StatusCode);
            }
        }

        [Fact]
        public async Task MonthlyVL_Test()
        {
            // arrange
            IEnumerable<ProductAssetValue> productAssetValues = new List<ProductAssetValue>
            {
                new ProductAssetValue
                {
                    ProductId = 1,
                    NETvalue = 1,
                    ProductName = "test",
                    ValuationAmmount = 1,
                    ValuationDate = DateTime.UtcNow
                },
                new ProductAssetValue
                {
                    ProductId = 1,
                    NETvalue = 2,
                    ProductName = "test",
                    ValuationAmmount = 1,
                    ValuationDate = DateTime.UtcNow.AddMonths(-1)
                },
                new ProductAssetValue
                {
                    ProductId = 1,
                    NETvalue = 3,
                    ProductName = "test",
                    ValuationAmmount = 1,
                    ValuationDate = DateTime.UtcNow.AddMonths(-2)
                }
            };
            var product = new Product
            {
                RDCode = 1,
                Name = "test"
            };

            productService.Setup(p => p.GetProduct(It.IsAny<Int32>())).ReturnsAsync(product);
            productService.Setup(p => p.GetProductMonthlyAssetValue(It.IsAny<Int32>(), It.IsAny<Int32>())).ReturnsAsync(productAssetValues);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object,
                    container.GetInstance<IConfiguration>());

                var result = (await sut.MonthlyVL(1, "test")) as OkObjectResult;

                // assert
                Assert.Equal(200, result.StatusCode);
                Assert.NotNull(result.Value);
            }
        }

        [Fact]
        public async Task MonthlyVL_BadRequest_Test()
        {
            // arrange
            IEnumerable<ProductAssetValue> productAssetValues = new List<ProductAssetValue>
            {
                new ProductAssetValue
                {
                    ProductId = 1,
                    NETvalue = 1,
                    ProductName = "test",
                    ValuationAmmount = 1,
                    ValuationDate = DateTime.UtcNow
                },
                new ProductAssetValue
                {
                    ProductId = 1,
                    NETvalue = 2,
                    ProductName = "test",
                    ValuationAmmount = 1,
                    ValuationDate = DateTime.UtcNow.AddMonths(-1)
                },
                new ProductAssetValue
                {
                    ProductId = 1,
                    NETvalue = 3,
                    ProductName = "test",
                    ValuationAmmount = 1,
                    ValuationDate = DateTime.UtcNow.AddMonths(-2)
                }
            };
            var product = new Product
            {
                RDCode = 1,
                Name = "test"
            };

            productService.Setup(p => p.GetProduct(It.IsAny<Int32>())).ReturnsAsync(product);
            productService.Setup(p => p.GetProductMonthlyAssetValue(It.IsAny<Int32>(), It.IsAny<Int32>())).ReturnsAsync(productAssetValues);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object,
                    container.GetInstance<IConfiguration>());

                var result = (await sut.MonthlyVL(0, "test")) as ObjectResult;

                // assert
                Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            }
        }

        [Fact]
        public async Task AnnualProfitability_Test()
        {
            // arrange
            IEnumerable<ProfitabilityPeriod> profitabilityPeriods = new List<ProfitabilityPeriod>
            {
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow,
                    Period =  DateTime.UtcNow.Month.ToString(),
                    Profitability = 20
                },
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow.AddYears(-1),
                    Period =  DateTime.UtcNow.AddYears(-1).Month.ToString(),
                    Profitability = 30
                },
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow.AddYears(-2),
                    Period =  DateTime.UtcNow.AddYears(-2).Month.ToString(),
                    Profitability = 30
                }
            };
            var product = new Product
            {
                RDCode = 1,
                Name = "test"
            };

            productService.Setup(p => p.GetProduct(It.IsAny<Int32>())).ReturnsAsync(product);
            productService.Setup(p => p.GetProductProfitabilityByPeriod(It.IsAny<Int32>(), It.IsAny<string>(), null, null, It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<Int32>())).ReturnsAsync(profitabilityPeriods);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object, 
                    container.GetInstance<IConfiguration>());

                var result = (await sut.AnnualProfitability(1, "test", 0, true)) as ObjectResult;

                // assert
                Assert.Equal(200, result.StatusCode);
                Assert.NotNull(result.Value);
            }
        }

        [Fact]
        public async Task AnnualProfitability_BadRequest_Test()
        {
            // arrange
            IEnumerable<ProfitabilityPeriod> profitabilityPeriods = new List<ProfitabilityPeriod>
            {
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow,
                    Period =  DateTime.UtcNow.Month.ToString(),
                    Profitability = 20
                },
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow.AddYears(-1),
                    Period =  DateTime.UtcNow.AddYears(-1).Month.ToString(),
                    Profitability = 30
                },
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow.AddYears(-2),
                    Period =  DateTime.UtcNow.AddYears(-2).Month.ToString(),
                    Profitability = 30
                }
            };
            var product = new Product
            {
                RDCode = 1,
                Name = "test"
            };

            productService.Setup(p => p.GetProduct(It.IsAny<Int32>())).ReturnsAsync(product);
            productService.Setup(p => p.GetProductProfitabilityByPeriod(It.IsAny<Int32>(), It.IsAny<string>(), null, null, It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<Int32>())).ReturnsAsync(profitabilityPeriods);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object,
                    container.GetInstance<IConfiguration>());

                var result = (await sut.AnnualProfitability(0, "test", 0, true)) as ObjectResult;

                // assert
                Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            }
        }

        [Fact]
        public async Task MonthlyProfitability_Test()
        {
            // arrange
            IEnumerable<ProfitabilityPeriod> profitabilityPeriods = new List<ProfitabilityPeriod>
            {
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow,
                    Period =  DateTime.UtcNow.Month.ToString(),
                    Profitability = 20
                },
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow.AddYears(-1),
                    Period =  DateTime.UtcNow.AddYears(-1).Month.ToString(),
                    Profitability = 30
                },
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow.AddYears(-2),
                    Period =  DateTime.UtcNow.AddYears(-2).Month.ToString(),
                    Profitability = 30
                }
            };
            var product = new Product
            {
                RDCode = 1,
                Name = "test"
            };

            productService.Setup(p => p.GetProduct(It.IsAny<Int32>())).ReturnsAsync(product);
            productService.Setup(p => p.GetProductProfitabilityByPeriod(It.IsAny<Int32>(), It.IsAny<string>(), It.IsAny<Int32>(), null, It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<Int32>())).ReturnsAsync(profitabilityPeriods);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object,
                    container.GetInstance<IConfiguration>());

                var result = (await sut.MonthlyProfitability(1, "test", 0)) as ObjectResult;

                // assert
                Assert.Equal(200, result.StatusCode);
                Assert.NotNull(result.Value);
            }
        }

        [Fact]
        public async Task MonthlyProfitability_BadRequest_Test()
        {
            // arrange
            IEnumerable<ProfitabilityPeriod> profitabilityPeriods = new List<ProfitabilityPeriod>
            {
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow,
                    Period =  DateTime.UtcNow.Month.ToString(),
                    Profitability = 20
                },
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow.AddYears(-1),
                    Period =  DateTime.UtcNow.AddYears(-1).Month.ToString(),
                    Profitability = 30
                },
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow.AddYears(-2),
                    Period =  DateTime.UtcNow.AddYears(-2).Month.ToString(),
                    Profitability = 30
                }
            };
            var product = new Product
            {
                RDCode = 1,
                Name = "test"
            };

            productService.Setup(p => p.GetProduct(It.IsAny<Int32>())).ReturnsAsync(product);
            productService.Setup(p => p.GetProductProfitabilityByPeriod(It.IsAny<Int32>(), It.IsAny<string>(), It.IsAny<Int32>(), null, It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<Int32>())).ReturnsAsync(profitabilityPeriods);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object,
                    container.GetInstance<IConfiguration>());

                var result = (await sut.MonthlyProfitability(0, "test", 0)) as ObjectResult;

                // assert
                Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            }
        }

        [Fact]
        public async Task CumulativeProfitability_Test()
        {
            // arrange
            IEnumerable<ProfitabilityPeriod> profitabilityPeriods = new List<ProfitabilityPeriod>
            {
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow,
                    Period =  "Inicio",
                    Profitability = 20
                },
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow.AddYears(-1),
                    Period = "Anio1",
                    Profitability = 30
                },
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow.AddYears(-2),
                    Period =  "Anio3",
                    Profitability = 30
                }
            };
            var product = new Product
            {
                RDCode = 1,
                Name = "test"
            };

            productService.Setup(p => p.GetProduct(It.IsAny<Int32>())).ReturnsAsync(product);
            productService.Setup(p => p.GetProductProfitabilityByPeriod(It.IsAny<Int32>(), It.IsAny<string>(), null, null, It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<Int32>())).ReturnsAsync(profitabilityPeriods);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object,
                    container.GetInstance<IConfiguration>());

                var result = (await sut.CumulativeProfitability(1, "", "")) as ObjectResult;

                // assert
                Assert.Equal(200, result.StatusCode);
                Assert.NotNull(result.Value);
            }
        }

        [Fact]
        public async Task CumulativeProfitability_BadResquest_Test()
        {
            // arrange
            IEnumerable<ProfitabilityPeriod> profitabilityPeriods = new List<ProfitabilityPeriod>
            {
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow,
                    Period =  "Inicio",
                    Profitability = 20,
                },
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow.AddYears(-1),
                    Period = "Anio1",
                    Profitability = 30
                },
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow.AddYears(-2),
                    Period =  "Anio3",
                    Profitability = 30
                }
            };
            var product = new Product
            {
                RDCode = 1,
                Name = "test"
            };

            productService.Setup(p => p.GetProduct(It.IsAny<Int32>())).ReturnsAsync(product);
            productService.Setup(p => p.GetProductProfitabilityByPeriod(It.IsAny<Int32>(), It.IsAny<string>(), null, null, It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<Int32>())).ReturnsAsync(profitabilityPeriods);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object,
                    container.GetInstance<IConfiguration>());

                var result = (await sut.CumulativeProfitability(0, "", "")) as ObjectResult;

                // assert
                Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            }
        }

        [Fact]
        public async Task AllLiquidityProfitabilityDateLastYear_Test()
        {
            // arrange
            IEnumerable<ProductDailyYtdProfitability> productProfitabilityDailyYtd = new List<ProductDailyYtdProfitability>
            {
                new ProductDailyYtdProfitability
                {
                    ProductId = 1,
                    ProductShortDesc = "test 1",
                    ValuationLastDayPY = DateTime.UtcNow,
                    NETvalueLastDayPY = 10,
                    LastDayPYProfitability = 10
                },
                new ProductDailyYtdProfitability
                {
                    ProductId = 2,
                    ProductShortDesc = "test 2",
                    ValuationLastDayPY = DateTime.UtcNow,
                    NETvalueLastDayPY = 10,
                    LastDayPYProfitability = 10
                },
            };
            IEnumerable<Product> products = new List<Product>
            {
                new Product{
                    RDCode = 1,
                    Name = "test 1",
                    MoProductId = 1
                },
                                new Product{
                    RDCode = 2,
                    Name = "test 2",
                    MoProductId = 2
                },
            };

            productService.Setup(p => p.GetProduct()).ReturnsAsync(products);
            productService.Setup(p => p.GetProfitabilityDailyYtd()).ReturnsAsync(productProfitabilityDailyYtd);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object,
                    container.GetInstance<IConfiguration>());

                var result = (await sut.AllLiquidityProfitabilityDateLastYear()) as ObjectResult;

                // assert
                Assert.Equal(200, result.StatusCode);
                Assert.NotNull(result.Value);
            }
        }

        [Fact]
        public async Task AllLiquidityProfitabilityDateLastYear_BadRequest_Test()
        {
            // arrange
            IEnumerable<ProductDailyYtdProfitability> productProfitabilityDailyYtd = new List<ProductDailyYtdProfitability>
            {
                new ProductDailyYtdProfitability
                {
                    ProductId = 1,
                    ProductShortDesc = "test 1",
                    ValuationLastDayPY = DateTime.UtcNow,
                    NETvalueLastDayPY = 10,
                    LastDayPYProfitability = 10
                },
                new ProductDailyYtdProfitability
                {
                    ProductId = 2,
                    ProductShortDesc = "test 2",
                    ValuationLastDayPY = DateTime.UtcNow,
                    NETvalueLastDayPY = 10,
                    LastDayPYProfitability = 10
                },
            };
            IEnumerable<Product> products = new List<Product>
            {
                new Product{
                    RDCode = 1,
                    Name = "test 1"
                },
                                new Product{
                    RDCode = 2,
                    Name = "test 2"
                },
            };

            productService.Setup(p => p.GetProduct()).ReturnsAsync(products);
            productService.Setup(p => p.GetProfitabilityDailyYtd()).ReturnsAsync(productProfitabilityDailyYtd);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object,
                    container.GetInstance<IConfiguration>());

                var result = (await sut.AllLiquidityProfitabilityDateLastYear()) as ObjectResult;

                // assert
                Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            }
        }

        [Fact]
        public async Task ProductResumenProfitability_Test()
        {
            // arrange
            IEnumerable<ProfitabilityPeriod> profitabilityPeriods = new List<ProfitabilityPeriod>
            {
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow,
                    Period =  "Inicio",
                    Profitability = 20
                },
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow.AddYears(-1),
                    Period = "Anio1",
                    Profitability = 30
                },
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow.AddYears(-2),
                    Period =  "Anio3",
                    Profitability = 30
                }
            };
            var product = new Product
            {
                RDCode = 1,
                Name = "test"
            };

            productService.Setup(p => p.GetProduct(It.IsAny<Int32>())).ReturnsAsync(product);
            productService.Setup(p => p.GetProductProfitabilityByPeriod(It.IsAny<Int32>(), It.IsAny<string>(), null, null, It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<Int32>())).ReturnsAsync(profitabilityPeriods);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object,
                    container.GetInstance<IConfiguration>());

                var result = (await sut.ProductResumenProfitability(1, "test")) as ObjectResult;

                // assert
                Assert.Equal(200, result.StatusCode);
                Assert.NotNull(result.Value);
            }
        }

        [Fact]
        public async Task ProductResumenProfitability_BadRequest_Test()
        {
            // arrange
            IEnumerable<ProfitabilityPeriod> profitabilityPeriods = new List<ProfitabilityPeriod>
            {
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow,
                    Period =  "Inicio",
                    Profitability = 20,
                },
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow.AddYears(-1),
                    Period = "Anio1",
                    Profitability = 30
                },
                new ProfitabilityPeriod
                {
                    ProductId = 1,
                    BeginDate = DateTime.UtcNow.AddYears(-2),
                    Period =  "Anio3",
                    Profitability = 30
                }
            };
            var product = new Product
            {
                RDCode = 1,
                Name = "test"
            };

            productService.Setup(p => p.GetProduct(It.IsAny<Int32>())).ReturnsAsync(product);
            productService.Setup(p => p.GetProductProfitabilityByPeriod(It.IsAny<Int32>(), It.IsAny<string>(), null, null, It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<Int32>())).ReturnsAsync(profitabilityPeriods);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object,
                    container.GetInstance<IConfiguration>());

                var result = (await sut.ProductResumenProfitability(0, "test")) as ObjectResult;

                // assert
                Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            }
        }

        [Fact]
        public async Task LiquidityValuesByDate_Test()
        {
            // arrange
            IEnumerable<ProductDailyYtdProfitability> liquidityValues = new List<ProductDailyYtdProfitability>
            {
                new ProductDailyYtdProfitability
                {
                    ProductId = 13,
                    NETValue = 57.5745m,
                    DailyProfitability = 0.0058m,
                    LastDayPYProfitability = 0.0076m,
                    ValuationDate = DateTime.UtcNow,
                    Assets = 10000000,
                    ProductDesc = string.Empty
                },
                new ProductDailyYtdProfitability
                {
                    ProductId = 11,
                    NETValue = 57.5745m,
                    DailyProfitability = 0.0058m,
                    LastDayPYProfitability = 0.0076m,
                    ValuationDate = DateTime.UtcNow,
                    Assets = 10000000,
                    ProductDesc = string.Empty
                },
                new ProductDailyYtdProfitability
                {
                    ProductId = 9,
                    NETValue = 57.5745m,
                    DailyProfitability = 0.0058m,
                    LastDayPYProfitability = 0.0076m,
                    ValuationDate = DateTime.UtcNow,
                    Assets = 10000000,
                    ProductDesc = string.Empty
                }
            };

            IEnumerable<Product> products = new List<Product>
            {
                new Product{
                     RDCode = 13,
                     Name = "bestinfond",
                     MoProductId = 1,
                     OrderToShow = 1,
                     Marketable = true,
                     ProductType = new ProductType
                     {
                         Id = "2",
                         Name = "Fondo de inversión",
                         OrderToShow = 1
                     }
                },
                new Product{
                     RDCode = 11,
                     Name = "bestinver internacional",
                     MoProductId = 4,
                     OrderToShow = 2,
                     Marketable = true,
                     ProductType = new ProductType
                     {
                         Id = "2",
                         Name = "Fondo de inversión",
                         OrderToShow = 1
                     }
                },
                new Product{
                     RDCode = 9,
                     Name = "bestinver bolsa",
                     MoProductId = 2,
                     OrderToShow = 3,
                     Marketable = true,
                     ProductType = new ProductType
                     {
                         Id = "2",
                         Name = "Fondo de inversión",
                         OrderToShow = 1
                     }
                },
            };

            productService.Setup(p => p.GetProduct()).ReturnsAsync(products);
            productService.Setup(p => p.GetProfitabilityDailyYtd()).ReturnsAsync(liquidityValues);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object,
                    container.GetInstance<IConfiguration>());

                var result = (await sut.LiquidityValuesByDate(DateTime.UtcNow, null)) as ObjectResult;

                // assert
                Assert.Equal(200, result.StatusCode);
                Assert.NotNull(result.Value);

                IEnumerable<LiquidityValuesByDateResponse> liquidatives = (IEnumerable<LiquidityValuesByDateResponse>)result.Value;
                Assert.Equal(3, liquidatives.Count());
            }
        }

        [Fact]
        public async Task LiquidityValuesByDate_Non_Marketable_Test()
        {
            // arrange
            IEnumerable<ProductDailyYtdProfitability> liquidityValues = new List<ProductDailyYtdProfitability>
            {
                new ProductDailyYtdProfitability
                {
                    ProductId = 13,
                    NETValue = 57.5745m,
                    DailyProfitability = 0.0058m,
                    LastDayPYProfitability = 0.0076m,
                    ValuationDate = DateTime.UtcNow,
                    Assets = 10000000,
                    ProductDesc = String.Empty
                },
                new ProductDailyYtdProfitability
                {
                    ProductId = 11,
                    NETValue = 57.5745m,
                    DailyProfitability = 0.0058m,
                    LastDayPYProfitability = 0.0076m,
                    ValuationDate = DateTime.UtcNow,
                    Assets = 10000000,
                    ProductDesc = String.Empty
                },
                new ProductDailyYtdProfitability
                {
                    ProductId = 9,
                    NETValue = 57.5745m,
                    DailyProfitability = 0.0058m,
                    LastDayPYProfitability = 0.0076m,
                    ValuationDate = DateTime.UtcNow,
                    Assets = 10000000,
                    ProductDesc = String.Empty
                }
            };

            IEnumerable<Product> products = new List<Product>
            {
                new Product{
                     RDCode = 13,
                     Name = "bestinfond",
                     MoProductId = 1,
                     OrderToShow = 1,
                     Marketable = true,
                     ProductType = new ProductType
                     {
                         Id = "2",
                         Name = "Fondo de inversión",
                         OrderToShow = 1
                     }
                },
                new Product{
                     RDCode = 11,
                     Name = "bestinver internacional",
                     MoProductId = 4,
                     OrderToShow = 2,
                     Marketable = true,
                     ProductType = new ProductType
                     {
                         Id = "2",
                         Name = "Fondo de inversión",
                         OrderToShow = 1
                     }
                },
                new Product{
                     RDCode = 9,
                     Name = "bestinver bolsa",
                     MoProductId = 2,
                     OrderToShow = 3,
                     Marketable = false,
                     ProductType = new ProductType
                     {
                         Id = "2",
                         Name = "Fondo de inversión",
                         OrderToShow = 1
                     }
                },
            };

            productService.Setup(p => p.GetProduct()).ReturnsAsync(products);
            productService.Setup(p => p.GetProfitabilityDailyYtd()).ReturnsAsync(liquidityValues);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object,
                    container.GetInstance<IConfiguration>());

                var result = (await sut.LiquidityValuesByDate(DateTime.UtcNow, null)) as ObjectResult;

                // assert
                Assert.Equal(200, result.StatusCode);
                Assert.NotNull(result.Value);

                IEnumerable<LiquidityValuesByDateResponse> liquidatives = (IEnumerable<LiquidityValuesByDateResponse>)result.Value;
                Assert.Equal(2, liquidatives.Count());
            }
        }

        [Fact]
        public async Task LiquidityValuesByDate_By_Product_Test()
        {
            // arrange
            IEnumerable<ProductDailyYtdProfitability> liquidityValues = new List<ProductDailyYtdProfitability>
            {
                new ProductDailyYtdProfitability
                {
                    ProductId = 13,
                    NETValue = 57.5745m,
                    DailyProfitability = 0.0058m,
                    LastDayPYProfitability = 0.0076m,
                    ValuationDate = DateTime.UtcNow,
                    Assets = 10000000,
                    ProductDesc = String.Empty
                },
                new ProductDailyYtdProfitability
                {
                    ProductId = 11,
                    NETValue = 57.5745m,
                    DailyProfitability = 0.0058m,
                    LastDayPYProfitability = 0.0076m,
                    ValuationDate = DateTime.UtcNow,
                    Assets = 10000000,
                    ProductDesc = String.Empty
                },
                new ProductDailyYtdProfitability
                {
                    ProductId = 9,
                    NETValue = 57.5745m,
                    DailyProfitability = 0.0058m,
                    LastDayPYProfitability = 0.0076m,
                    ValuationDate = DateTime.UtcNow,
                    Assets = 10000000,
                    ProductDesc = String.Empty
                }
            };

            IEnumerable<Product> products = new List<Product>
            {
                new Product{
                     RDCode = 13,
                     Name = "bestinfond",
                     MoProductId = 1,
                     OrderToShow = 1,
                     Marketable = true,
                     ProductType = new ProductType
                     {
                         Id = "2",
                         Name = "Fondo de inversión",
                         OrderToShow = 1
                     }
                },
                new Product{
                     RDCode = 11,
                     Name = "bestinver internacional",
                     MoProductId = 4,
                     OrderToShow = 2,
                     Marketable = true,
                     ProductType = new ProductType
                     {
                         Id = "2",
                         Name = "Fondo de inversión",
                         OrderToShow = 1
                     }
                },
                new Product{
                     RDCode = 9,
                     Name = "bestinver bolsa",
                     MoProductId = 2,
                     OrderToShow = 3,
                     Marketable = true,
                     ProductType = new ProductType
                     {
                         Id = "2",
                         Name = "Fondo de inversión",
                         OrderToShow = 1
                     }
                },
            };

            productService.Setup(p => p.GetProduct()).ReturnsAsync(products);
            productService.Setup(p => p.GetProfitabilityDailyYtd()).ReturnsAsync(liquidityValues);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object,
                    container.GetInstance<IConfiguration>());

                var result = (await sut.LiquidityValuesByDate(DateTime.UtcNow, 1)) as ObjectResult;

                // assert
                Assert.Equal(200, result.StatusCode);
                Assert.NotNull(result.Value);

                IEnumerable<LiquidityValuesByDateResponse> liquidatives = (IEnumerable<LiquidityValuesByDateResponse>)result.Value;
                Assert.Single(liquidatives);
            }
        }

        [Fact]
        public async Task LiquidityValuesByDate_By_Non_Marketable_Product_Test()
        {
            // arrange
            IEnumerable<ProductDailyYtdProfitability> liquidityValues = new List<ProductDailyYtdProfitability>
            {
                new ProductDailyYtdProfitability
                {
                    ProductId = 13,
                    NETValue = 57.5745m,
                    DailyProfitability = 0.0058m,
                    LastDayPYProfitability = 0.0076m,
                    ValuationDate = DateTime.UtcNow,
                    Assets = 10000000,
                    ProductDesc = String.Empty
                },
                new ProductDailyYtdProfitability
                {
                    ProductId = 11,
                    NETValue = 57.5745m,
                    DailyProfitability = 0.0058m,
                    LastDayPYProfitability = 0.0076m,
                    ValuationDate = DateTime.UtcNow,
                    Assets = 10000000,
                    ProductDesc = String.Empty
                },
                new ProductDailyYtdProfitability
                {
                    ProductId = 9,
                    NETValue = 57.5745m,
                    DailyProfitability = 0.0058m,
                    LastDayPYProfitability = 0.0076m,
                    ValuationDate = DateTime.UtcNow,
                    Assets = 10000000,
                    ProductDesc = String.Empty
                }
            };

            IEnumerable<Product> products = new List<Product>
            {
                new Product{
                     RDCode = 13,
                     Name = "bestinfond",
                     MoProductId = 1,
                     OrderToShow = 1,
                     Marketable = false,
                     ProductType = new ProductType
                     {
                         Id = "2",
                         Name = "Fondo de inversión",
                         OrderToShow = 1
                     }
                },
                new Product{
                     RDCode = 11,
                     Name = "bestinver internacional",
                     MoProductId = 4,
                     OrderToShow = 2,
                     Marketable = true,
                     ProductType = new ProductType
                     {
                         Id = "2",
                         Name = "Fondo de inversión",
                         OrderToShow = 1
                     }
                },
                new Product{
                     RDCode = 9,
                     Name = "bestinver bolsa",
                     MoProductId = 2,
                     OrderToShow = 3,
                     Marketable = true,
                     ProductType = new ProductType
                     {
                         Id = "2",
                         Name = "Fondo de inversión",
                         OrderToShow = 1
                     }
                },
            };

            productService.Setup(p => p.GetProduct()).ReturnsAsync(products);
            productService.Setup(p => p.GetProfitabilityDailyYtd()).ReturnsAsync(liquidityValues);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                // act
                var sut = new ProfitabilityController(
                    productService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object,
                    container.GetInstance<IConfiguration>());

                var result = (await sut.LiquidityValuesByDate(DateTime.UtcNow, 1)) as ObjectResult;

                // assert
                Assert.Equal(200, result.StatusCode);
                Assert.NotNull(result.Value);

                IEnumerable<LiquidityValuesByDateResponse> liquidatives = (IEnumerable<LiquidityValuesByDateResponse>)result.Value;
                Assert.Single(liquidatives);
            }
        }

    }
}
