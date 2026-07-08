using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Carteras;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.Wordpress.WS.Controllers;
using BESTINVER.Wordpress.WS.Tests.Builders;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using SimpleInjector.Lifestyles;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;


namespace BESTINVER.Wordpress.WS.Tests.Controllers
{
    public class CarterasControllerTest : IClassFixture<DependenciesBuilder>
    {
        private readonly DependenciesBuilder dependenciesBuilder;
        private readonly Mock<ICarteraService> carterasService = new();
        private readonly Mock<ILogger<CarterasController>> logger = new();

        public CarterasControllerTest(DependenciesBuilder db)
        {
            this.dependenciesBuilder = db.WithContainer().WithDependencies();
        }

        [Fact]
        public async Task TopPositions_Test()
        {
            IEnumerable<CarteraPositionBySector> carteras = new List<CarteraPositionBySector>()
            {
                new CarteraPositionBySector
                {
                    CarteraName= "FINANCIERO",
                    InstrumentPositions = new List<InstrumentPosition>
                    {
                        new InstrumentPosition
                        {
                            Diversificacion = "384",
                            NombreInstrumento = "STANDARD CHARTERED PLC",

                        },
                        new InstrumentPosition
                        {
                            Diversificacion = "241",
                            NombreInstrumento = "ING GROUP"
                        },
                        new InstrumentPosition
                        {
                            Diversificacion = "162",
                            NombreInstrumento = "INTESA SANPAOLO"
                        }
                    }
                },
                new CarteraPositionBySector
                {
                    CarteraName= "INDUSTRIA",
                    InstrumentPositions = new List<InstrumentPosition>
                    {
                        new InstrumentPosition
                        {
                            Diversificacion = "384",
                            NombreInstrumento = "DASSAULT AVIATION SA"
                        },
                        new InstrumentPosition
                        {
                            Diversificacion = "241",
                            NombreInstrumento = "KONECRANES OYJ"
                        },
                        new InstrumentPosition
                        {
                            Diversificacion = "162",
                            NombreInstrumento = "ANDRITZ AG"
                        }
                    }
                },
                new CarteraPositionBySector
                {
                    CarteraName= "COMUNICACION Y TEC.",
                    InstrumentPositions = new List<InstrumentPosition>
                    {
                        new InstrumentPosition
                        {
                            Diversificacion = "384",
                            NombreInstrumento = "INFORMA PLC"
                        },
                        new InstrumentPosition
                        {
                            Diversificacion = "241",
                            NombreInstrumento = "RELX PLC (GBP)"
                        },
                        new InstrumentPosition
                        {
                            Diversificacion = "162",
                            NombreInstrumento = "LIONS GATE ENTERTAINMENT"
                        }
                    }
                },
                new CarteraPositionBySector
                {
                    CarteraName= "CONSUMO",
                    InstrumentPositions = new List<InstrumentPosition>
                    {
                        new InstrumentPosition
                        {
                            Diversificacion = "384",
                            NombreInstrumento = "CIA BRASILEIRA"
                        },
                        new InstrumentPosition
                        {
                            Diversificacion = "241",
                            NombreInstrumento = "JUST EAT"
                        },
                        new InstrumentPosition
                        {
                            Diversificacion = "162",
                            NombreInstrumento = "DELIVERY HERO AG"
                        }
                    }
                }
            };

            carterasService.Setup(p => p.GetCarterasTopPositions(It.IsAny<Int32>())).ReturnsAsync(carteras);

            var container = dependenciesBuilder.Build();

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new CarterasController(
                    carterasService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object);

                var result = (await sut.TopPositions(13)) as ObjectResult;
                Assert.NotNull(result);
                Assert.Equal(200, result.StatusCode);
                Assert.NotNull(result.Value);
            }
        }

        [Fact]
        public async Task TopPositionsBySector_Test()
        {
            IEnumerable<CarteraPositionBySector> carteras = new List<CarteraPositionBySector>()
            {
                new CarteraPositionBySector
                {
                    CarteraName= "FINANCIERO",
                    InstrumentPositions = new List<InstrumentPosition>
                    {
                        new InstrumentPosition
                        {
                            Diversificacion = "384",
                            NombreInstrumento = "STANDARD CHARTERED PLC"
                        },
                        new InstrumentPosition
                        {
                            Diversificacion = "241",
                            NombreInstrumento = "ING GROUP"
                        },
                        new InstrumentPosition
                        {
                            Diversificacion = "162",
                            NombreInstrumento = "INTESA SANPAOLO"
                        }
                    }
                }
            };

            carterasService.Setup(p => p.GetCarterasTopPositions(It.IsAny<Int32>(), It.IsAny<string>(), It.IsAny<Int32>())).ReturnsAsync(carteras);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new CarterasController(
                    carterasService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object);

                var result = (await sut.TopPositions(13, "FINANCIERO", 3)) as OkObjectResult;
                Assert.Equal(200, result.StatusCode);
                Assert.NotNull(result.Value);
            }
        }

        [Fact]
        public async Task SectoralDistribution_Test()
        {
            Dictionary<string, string> carteras = new Dictionary<string, string>();
            carteras.Add("test", "test");

            carterasService.Setup(p => p.GetSectoralDistribution(It.IsAny<Int32>())).ReturnsAsync(carteras);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new CarterasController(
                    carterasService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object);

                var result = (await sut.SectoralDistribution(1)) as OkObjectResult;
                Assert.Equal(200, result.StatusCode);
                Assert.NotNull(result.Value);
            }
        }

        [Fact]
        public async Task GeographicalDistribution_Test()
        {
            Dictionary<string, string> carteras = new Dictionary<string, string>();
            carteras.Add("test", "test");

            carterasService.Setup(p => p.GetGeographicalDistribution(It.IsAny<Int32>())).ReturnsAsync(carteras);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new CarterasController(
                    carterasService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object);

                var result = (await sut.GeographicalDistribution(1)) as OkObjectResult;
                Assert.Equal(200, result.StatusCode);
                Assert.NotNull(result.Value);
            }
        }

        [Fact]
        public async Task DataToDateCarteras_Test()
        {
            DateTime date = DateTime.UtcNow;

            carterasService.Setup(p => p.GetDataToDate()).ReturnsAsync(date);

            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new CarterasController(
                    carterasService.Object,
                    container.GetInstance<IMapper>(),
                    logger.Object);

                var result = (await sut.DataToDateCarteras()) as OkObjectResult;
                Assert.Equal(200, result.StatusCode);
                Assert.NotNull(result.Value);
            }
        }
    }
}