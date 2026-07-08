using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Remediation;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Public.Controllers;
using BESTINVER.GestorAltas.Web.Public.Models.Remediacion;
using BESTINVER.GestorAltas.Web.Remediacion.Builders;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using SimpleInjector.Lifestyles;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Xunit;

namespace BESTINVER.GestorAltas.Web.Remediacion.Controllers
{
    public class RemediacionControllerTest : IClassFixture<DependenciesBuilder>
    {
        private readonly DependenciesBuilder dependenciesBuilder;

        private readonly Mock<IRemediationService> remediationService = new();
        private readonly Mock<IApplicantService> applicationService = new();
        private readonly Mock<ISignUpService> signUpService = new();
        private readonly Mock<ISignaturesService> signaturesService = new();
        private readonly Mock<ITestService> testService = new();
        private readonly Mock<IHttpContextAccessor> httpContextAccessor = new();
        private readonly Mock<ILogger<RemediacionController>> logger = new();
        private readonly Mock<ISendMailService> sendHelpMailService = new();
        private readonly Mock<IOptions<AppSettings>> appSettings = new();

        public RemediacionControllerTest(DependenciesBuilder db)
        {
            var context = new DefaultHttpContext();
            context.Request.PathBase = "/base";
            context.Request.Path = "/test-path";
            httpContextAccessor.Setup(_ => _.HttpContext).Returns(context);

            this.dependenciesBuilder = db.WithContainer();
        }

        [Fact]
        public async Task Index_Test()
        {
            var remediacionRequest = new RemediacionRequest
            {
                Applicant = new RemediacionApplicant
                {
                    RDTitular = "1512"
                }
            };

            remediationService.Setup(p => p.GetRequestByRequestId(It.IsAny<String>())).ReturnsAsync(remediacionRequest);

            var container = dependenciesBuilder.Build();

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new RemediacionController(
                    remediationService.Object,
                    applicationService.Object,
                    signUpService.Object,
                    container.GetInstance<IMapper>(),
                    signaturesService.Object,
                    testService.Object,
                    sendHelpMailService.Object,
                    appSettings.Object,
                    logger.Object
                    );

                var result = (await sut.Index("cnQ9MTUxMiZudD0wMTE4NTQ2OFcmY3Q9MTQyOSZ0PS4yMDE3LTEwLTIzVDEzOjU1OjIwLjYyMDQxODJa")) as ViewResult;
                Assert.NotNull(result);
            }
        }

        [Fact]
        public async Task Index_No_QuesryString_Test()
        {
            remediationService.Setup(p => p.GetRequestByRequestId(It.IsAny<String>())).ReturnsAsync(new RemediacionRequest());

            var container = dependenciesBuilder.Build();

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new RemediacionController(
                    remediationService.Object,
                    applicationService.Object,
                    signUpService.Object,
                    container.GetInstance<IMapper>(),
                    signaturesService.Object,
                    testService.Object,
                    sendHelpMailService.Object,
                    appSettings.Object,
                    logger.Object
                    );

                var result = (await sut.Index("")) as ViewResult;
                Assert.NotNull(result);
                Assert.Equal("RemediacionErrorView", result.ViewName);
            }
        }

        [Fact]
        public async Task PersonalData_Test()
        {
            var remediacionRequest = new RemediacionRequest
            {
                Applicant = new RemediacionApplicant
                {
                    RDTitular = "1512"
                },
                RemediacionRequestStatus = new List<RemediacionRequestStatus>() { new RemediacionRequestStatus() {
                        Id = 189,
                        IdRemediacionRequest = Guid.Parse("8AEBF411-88B4-4D51-988C-7B2EDB263BEF"),
                        IdStatus = 1,
                        Created = new DateTime(2021,11, 26, 13, 13, 04)
                    }
                }
            };

            remediationService.Setup(p => p.GetRequestByRequestId(It.IsAny<String>())).ReturnsAsync(remediacionRequest);

            var container = dependenciesBuilder.Build();

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new RemediacionController(
                    remediationService.Object,
                    applicationService.Object,
                    signUpService.Object,
                    container.GetInstance<IMapper>(),
                    signaturesService.Object,
                    testService.Object,
                    sendHelpMailService.Object,
                    appSettings.Object,
                    logger.Object
                    );

                var model = new RemediacionPersonalDataModel()
                {
                    RemediacionId = Guid.Parse("8AEBF411-88B4-4D51-988C-7B2EDB263BEF"),
                    Birthday = new DateTime(1983, 8, 21),
                    BornPlace = "vidal",
                    Dni = "05307627D",
                    RDTitular = "100286",
                    Nacionality = 1,
                    Country = 1
                };

                var result = (await sut.PersonalData(model)) as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            }
        }

        [Fact]
        public async Task Dni_Test()
        {
            var remediacionRequest = new RemediacionRequest
            {
                Applicant = new RemediacionApplicant
                {
                    RDTitular = "1512"
                },
                RemediacionRequestStatus = new List<RemediacionRequestStatus>() { new RemediacionRequestStatus() {
                        Id = 189,
                        IdRemediacionRequest = Guid.Parse("8AEBF411-88B4-4D51-988C-7B2EDB263BEF"),
                        IdStatus = 1,
                        Created = new DateTime(2021,11, 26, 13, 13, 04)
                    }
                }
            };

            remediationService.Setup(p => p.GetRequestByRequestId(It.IsAny<String>())).ReturnsAsync(remediacionRequest);

            var container = dependenciesBuilder.Build();

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new RemediacionController(
                    remediationService.Object,
                    applicationService.Object,
                    signUpService.Object,
                    container.GetInstance<IMapper>(),
                    signaturesService.Object,
                    testService.Object,
                    sendHelpMailService.Object,
                    appSettings.Object,
                    logger.Object
                    );
                sut.ControllerContext = new ControllerContext
                {
                    HttpContext = httpContextAccessor.Object.HttpContext
                };
                var model = new RemediacionModel()
                {
                    RemediacionId = "8AEBF411-88B4-4D51-988C-7B2EDB263BEF",
                    Dni = new RemediacionDniModel()
                    {
                        IsPermanent = false,
                        ExpirationYear = 2023,
                        ExpirationMonth = 10,
                        ExpirationDay = 03,
                        AnversoDni = string.Empty,
                        ReversoDni = string.Empty
                    }
                };

                var result = (await sut.Dni(model)) as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            }
        }

        [Fact]
        public async Task KnowledgeTest_Test()
        {
            var remediacionRequest = new RemediacionRequest
            {
                Applicant = new RemediacionApplicant
                {
                    RDTitular = "1512"
                },
                RemediacionRequestStatus = new List<RemediacionRequestStatus>() { new RemediacionRequestStatus() {
                        Id = 756,
                        IdRemediacionRequest = Guid.Parse("CBBB82D7-BF31-4C35-80C6-C9CB7C61F8C6"),
                        IdStatus = 1,
                        Created = new DateTime(2021,11, 26, 13, 13, 04)
                    }
                }
            };

            remediationService.Setup(p => p.GetRequestByRequestId(It.IsAny<String>())).ReturnsAsync(remediacionRequest);

            var container = dependenciesBuilder.Build();

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new RemediacionController(
                    remediationService.Object,
                    applicationService.Object,
                    signUpService.Object,
                    container.GetInstance<IMapper>(),
                    signaturesService.Object,
                    testService.Object,
                    sendHelpMailService.Object,
                    appSettings.Object,
                    logger.Object
                    );

                sut.ControllerContext = new ControllerContext
                {
                    HttpContext = httpContextAccessor.Object.HttpContext
                };
                var model = new RemediacionQuestionData()
                {
                    RemediacionId = "CBBB82D7-BF31-4C35-80C6-C9CB7C61F8C6",
                    Dni = new RemediacionDniModel()
                    {
                        IsPermanent = false,
                        ExpirationYear = 2050,
                        ExpirationMonth = 1,
                        ExpirationDay = 1,
                        AnversoDni = string.Empty,
                        ReversoDni = string.Empty
                    },
                    Answers = new List<Models.QuestionAnswerModel>() { new Models.QuestionAnswerModel() {
                        IdAnswer = 124,
                        IdQuestion = 34,
                        OtherAnswer = string.Empty
                    } },
                    ClientId = "204815",
                    PersonalData = new RemediacionPersonalDataModel() { Role = (int)TestTypeEnum.PersonaFísica },
                    JuridicApplicants = new List<Models.Remediacion.JuridicApplicantRem>() { new Models.Remediacion.JuridicApplicantRem() {
                        RdCode = 204815,
                        RequestApplicantTypeId = 1
                    } },
                    KnowledgeFile = string.Empty,
                    IsExpiredKnowledgeTest = true,
                    UpdateDocument = false,
                    RemediacionChannel = 2
                };

                var result = (await sut.KnowledgeTest(model)) as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            }
        }

        //[Fact]
        internal async Task SignatureData_Test()
        {
            var remediacionRequest = new RemediacionRequest
            {
                Applicant = new RemediacionApplicant
                {
                    RDTitular = "1512"
                },
                RemediacionRequestStatus = new List<RemediacionRequestStatus>() { new RemediacionRequestStatus() {
                        Id = 756,
                        IdRemediacionRequest = Guid.Parse("CBBB82D7-BF31-4C35-80C6-C9CB7C61F8C6"),
                        IdStatus = 1,
                        Created = new DateTime(2021,11, 26, 13, 13, 04)
                    }
                }
            };

            remediationService.Setup(p => p.GetRequestByRequestId(It.IsAny<String>())).ReturnsAsync(remediacionRequest);

            var container = dependenciesBuilder.Build();

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new RemediacionController(
                    remediationService.Object,
                    applicationService.Object,
                    signUpService.Object,
                    container.GetInstance<IMapper>(),
                    signaturesService.Object,
                    testService.Object,
                    sendHelpMailService.Object,
                    appSettings.Object,
                    logger.Object
                    );

                var model = new RemediacionQuestionData()
                {
                    RemediacionId = "FB925BBB-B85F-4DD1-978C-03BCD4E61D39",
                    Dni = new RemediacionDniModel()
                    {
                        IsPermanent = false,
                        ExpirationYear = 2050,
                        ExpirationMonth = 1,
                        ExpirationDay = 1,
                        AnversoDni = string.Empty,
                        ReversoDni = string.Empty
                    },
                    Answers = new List<Models.QuestionAnswerModel>() { new Models.QuestionAnswerModel() {
                        IdAnswer = 124,
                        IdQuestion = 34,
                        OtherAnswer = string.Empty
                    } },
                    ClientId = "204815",
                    PersonalData = new RemediacionPersonalDataModel() { Role = (int)TestTypeEnum.PersonaFísica },
                    JuridicApplicants = new List<Models.Remediacion.JuridicApplicantRem>() { new Models.Remediacion.JuridicApplicantRem() {
                        RdCode = 204815,
                        RequestApplicantTypeId = 1
                    } },
                    KnowledgeFile = string.Empty,
                    IsExpiredKnowledgeTest = true,
                    UpdateDocument = false,
                    RemediacionChannel = 2
                };

                var result = (await sut.SignatureData(model)) as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            }
        }

        //[Fact]
        internal async Task JuridicSignatureData_Test()
        {
            var remediacionRequest = new RemediacionRequest
            {
                Applicant = new RemediacionApplicant
                {
                    RDTitular = "1512"
                },
                RemediacionRequestStatus = new List<RemediacionRequestStatus>() { new RemediacionRequestStatus() {
                        Id = 756,
                        IdRemediacionRequest = Guid.Parse("787A3C95-E0E9-479F-8430-BC48BAEBAF87"),
                        IdStatus = 1,
                        Created = new DateTime(2021,11, 26, 13, 13, 04)
                    }
                }
            };

            remediationService.Setup(p => p.GetRequestByRequestId(It.IsAny<String>())).ReturnsAsync(remediacionRequest);

            var container = dependenciesBuilder.Build();

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new RemediacionController(
                    remediationService.Object,
                    applicationService.Object,
                    signUpService.Object,
                    container.GetInstance<IMapper>(),
                    signaturesService.Object,
                    testService.Object,
                    sendHelpMailService.Object,
                    appSettings.Object,
                    logger.Object
                    );

                var model = new JuridicRemediacionModel()
                {
                    RemediacionId = "787A3C95-E0E9-479F-8430-BC48BAEBAF87",
                    RemediacionModelList = new List<RemediacionModel>() {
                        new RemediacionModel() {
                            RemediacionId = "787A3C95-E0E9-479F-8430-BC48BAEBAF87",
                            ClientId = "160842"
                        }
                    }
                };

                var result = (await sut.JuridicSignatureData(model)) as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            }
        }

        [Fact]
        public async Task SetRemediationSigned_Test()
        {
            var remediacionRequest = new RemediacionRequest
            {
                Applicant = new RemediacionApplicant
                {
                    RDTitular = "1512"
                },
                RemediacionRequestStatus = new List<RemediacionRequestStatus>() { new RemediacionRequestStatus() {
                        Id = 756,
                        IdRemediacionRequest = Guid.Parse("787A3C95-E0E9-479F-8430-BC48BAEBAF87"),
                        IdStatus = 1,
                        Created = new DateTime(2021,11, 26, 13, 13, 04)
                    }
                }
            };

            remediationService.Setup(p => p.GetRequestByRequestId(It.IsAny<String>())).ReturnsAsync(remediacionRequest);

            var container = dependenciesBuilder.Build();

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new RemediacionController(
                    remediationService.Object,
                    applicationService.Object,
                    signUpService.Object,
                    container.GetInstance<IMapper>(),
                    signaturesService.Object,
                    testService.Object,
                    sendHelpMailService.Object,
                    appSettings.Object,
                    logger.Object
                    );

                var requestId = Guid.Parse("787A3C95-E0E9-479F-8430-BC48BAEBAF87");

                var result = (await sut.SetRemediationSigned(requestId, false)) as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            }
        }

        [Fact]
        public async Task SetJuridicRemediationSigned_Test()
        {
            var remediacionRequest = new RemediacionRequest
            {
                Applicant = new RemediacionApplicant
                {
                    RDTitular = "1512"
                },
                RemediacionRequestStatus = new List<RemediacionRequestStatus>() { new RemediacionRequestStatus() {
                        Id = 756,
                        IdRemediacionRequest = Guid.Parse("787A3C95-E0E9-479F-8430-BC48BAEBAF87"),
                        IdStatus = 1,
                        Created = new DateTime(2021,11, 26, 13, 13, 04)
                    }
                }
            };

            remediationService.Setup(p => p.GetRequestByRequestId(It.IsAny<String>())).ReturnsAsync(remediacionRequest);

            var container = dependenciesBuilder.Build();

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new RemediacionController(
                    remediationService.Object,
                    applicationService.Object,
                    signUpService.Object,
                    container.GetInstance<IMapper>(),
                    signaturesService.Object,
                    testService.Object,
                    sendHelpMailService.Object,
                    appSettings.Object,
                    logger.Object
                    );

                var requestId = Guid.Parse("8AEBF411-88B4-4D51-988C-7B2EDB263BEF");
                int applicantId = 164178;

                var result = (await sut.SetJuridicRemediationSigned(requestId, applicantId, false)) as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            }
        }

        [Fact]
        public async Task CompleteProcess_Test()
        {
            var remediacionRequest = new RemediacionRequest
            {
                Applicant = new RemediacionApplicant
                {
                    RDTitular = "1512"
                },
                RemediacionRequestStatus = new List<RemediacionRequestStatus>() { new RemediacionRequestStatus() {
                        Id = 756,
                        IdRemediacionRequest = Guid.Parse("787A3C95-E0E9-479F-8430-BC48BAEBAF87"),
                        IdStatus = 1,
                        Created = new DateTime(2021,11, 26, 13, 13, 04)
                    }
                }
            };

            remediationService.Setup(p => p.GetRequestByRequestId(It.IsAny<String>())).ReturnsAsync(remediacionRequest);

            var container = dependenciesBuilder.Build();

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new RemediacionController(
                    remediationService.Object,
                    applicationService.Object,
                    signUpService.Object,
                    container.GetInstance<IMapper>(),
                    signaturesService.Object,
                    testService.Object,
                    sendHelpMailService.Object,
                    appSettings.Object,
                    logger.Object
                    );

                var model = new RemediacionModel()
                {
                    UpdateDocument = true,
                    RemediacionId = "8AEBF411-88B4-4D51-988C-7B2EDB263BEF"
                };

                var result = (await sut.CompleteProcess(model)) as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            }
        }

        [Fact]
        public async Task SendHelpMail_Test()
        {
            var remediacionRequest = new RemediacionRequest
            {
                Applicant = new RemediacionApplicant
                {
                    RDTitular = "1512"
                },
                RemediacionRequestStatus = new List<RemediacionRequestStatus>() { new RemediacionRequestStatus() {
                        Id = 756,
                        IdRemediacionRequest = Guid.Parse("787A3C95-E0E9-479F-8430-BC48BAEBAF87"),
                        IdStatus = 1,
                        Created = new DateTime(2021,11, 26, 13, 13, 04)
                    }
                }
            };

            remediationService.Setup(p => p.GetRequestByRequestId(It.IsAny<String>())).ReturnsAsync(remediacionRequest);

            var container = dependenciesBuilder.Build();

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new RemediacionController(
                    remediationService.Object,
                    applicationService.Object,
                    signUpService.Object,
                    container.GetInstance<IMapper>(),
                    signaturesService.Object,
                    testService.Object,
                    sendHelpMailService.Object,
                    appSettings.Object,
                    logger.Object
                    );

                string phone = "666666666";

                var result = (await sut.SendHelpMail(phone)) as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            }
        }

        [Fact]
        public async Task LegalModalContent_Test()
        {
            var remediacionRequest = new RemediacionRequest
            {
                Applicant = new RemediacionApplicant
                {
                    RDTitular = "1512"
                },
                RemediacionRequestStatus = new List<RemediacionRequestStatus>() { new RemediacionRequestStatus() {
                        Id = 756,
                        IdRemediacionRequest = Guid.Parse("787A3C95-E0E9-479F-8430-BC48BAEBAF87"),
                        IdStatus = 1,
                        Created = new DateTime(2021,11, 26, 13, 13, 04)
                    }
                }
            };

            remediationService.Setup(p => p.GetRequestByRequestId(It.IsAny<String>())).ReturnsAsync(remediacionRequest);

            var container = dependenciesBuilder.Build();

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new RemediacionController(
                    remediationService.Object,
                    applicationService.Object,
                    signUpService.Object,
                    container.GetInstance<IMapper>(),
                    signaturesService.Object,
                    testService.Object,
                    sendHelpMailService.Object,
                    appSettings.Object,
                    logger.Object
                    );


                var result = (await sut.LegalModalContent()) as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            }
        }

        [Fact]
        public async Task AskForRequiredRealOwner_Test()
        {
            var remediacionRequest = new RemediacionRequest
            {
                Applicant = new RemediacionApplicant
                {
                    RDTitular = "1512"
                },
                RemediacionRequestStatus = new List<RemediacionRequestStatus>() { new RemediacionRequestStatus() {
                        Id = 756,
                        IdRemediacionRequest = Guid.Parse("787A3C95-E0E9-479F-8430-BC48BAEBAF87"),
                        IdStatus = 1,
                        Created = new DateTime(2021,11, 26, 13, 13, 04)
                    }
                }
            };

            remediationService.Setup(p => p.GetRequestByRequestId(It.IsAny<String>())).ReturnsAsync(remediacionRequest);

            var container = dependenciesBuilder.Build();

            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var sut = new RemediacionController(
                    remediationService.Object,
                    applicationService.Object,
                    signUpService.Object,
                    container.GetInstance<IMapper>(),
                    signaturesService.Object,
                    testService.Object,
                    sendHelpMailService.Object,
                    appSettings.Object,
                    logger.Object
                    );

                var model = new RequestRequiredRealOwner();

                var result = (await sut.AskForRequiredRealOwner(model)) as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            }
        }
    }
}
