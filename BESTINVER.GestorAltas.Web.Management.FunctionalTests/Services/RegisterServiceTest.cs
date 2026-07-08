using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BESTINVER.GestorAltas.MicroservicesProxy.Exceptions;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using SimpleInjector.Lifestyles;
using System;
using System.Threading.Tasks;
using Xunit;
using System.Collections.Generic;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Request;
using BESTINVER.GestorAltas.Web.Management.FunctionalTests.Builders;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.Services
{
    public class RegisterServiceTest : IClassFixture<DependenciesBuilder>
    {

        private readonly DependenciesBuilder dependenciesBuilder;
        private SignUpApplicant titular;
        private RequestData requestData;

        public RegisterServiceTest(DependenciesBuilder dependenciesBuilder)
        {
            this.dependenciesBuilder = dependenciesBuilder.WithContainer().WithDependencies();
            Initialize();
        }

        private void Initialize()
        {
            titular = new SignUpApplicant
            {
                BasicData = new ApplicantBasicData
                {
                    ApplicantType = (int)ApplicantType.Fisica,
                    Dni = Helpers.Helper.RandomDni(),
                    Email = "pleon@kabel.es",
                    FirstSurname = "Leon",
                    IDDocumentType = "DNI",
                    MobilePhoneNumber = "620536312",
                    Name = "Pedro",
                    SecondSurname = "Gomez",
                    RequestApplicantType = (int)ApplicantRoleType.Titular
                },
                PersonalData = new SignUpRequestApplicantPersonalData
                {
                    Gender = (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.GenderType.Hombre
                }
            };

            requestData = new RequestData
            {
                IdInitialProduct = 1,
                IdRequestChannel = (int)RequestChannelType.Publica,
                Web = true
            };
        }

        [Fact]
        public async Task CreateRequestFirstStep_OK_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IRegisterService>();
                var result = await service.SaveBasicData(titular, requestData);

                Assert.NotNull(result);
            }
        }

        [Fact]
        public async Task CreateRequestFirstStep_Holder_Exists_Continue_Request_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IRegisterService>();
                titular.BasicData.Dni = "77109618W";

                var result = await service.SaveBasicData(titular, requestData);

                Assert.Equal(new Guid("0D6B4E24-A44F-4215-96F1-78B9AA06BFB7"), result.Id);
            }
        }

        [Fact]
        public async Task CreateRequestFirstStep_Holder_Exists_Block_Request_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IRegisterService>();
                titular.BasicData.Dni = "50435730L";

                try
                {
                    var result = await service.SaveBasicData(titular, requestData);
                }
                catch (Exception ex)
                {
                    Assert.Equal(typeof(InvalidOperationException), ex.GetType());
                }
            }
        }

        [Fact]
        public async Task CreateRequestFirstStep_Holder_Exists_With_Canceled_Request_Create_New_Request_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IRegisterService>();
                titular.BasicData.Dni = "07067809R";

                var result = await service.SaveBasicData(titular, requestData);

                Assert.NotEqual(new Guid("d099bd6a-140b-47f3-aa40-c8e03f8ca05a"), result.Id);
            }
        }

        [Fact]
        public async Task CreateRequestFirstStep_RD_KO_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IRegisterService>();
                titular.BasicData.Dni = "82279763T";

                try
                {
                    var result = await service.SaveBasicData(titular, requestData);
                    Assert.Null(result);
                }
                catch (Exception ex)
                {
                    Assert.True(typeof(RDConflictException) == ex.GetType() || typeof(InvalidOperationException) == ex.GetType());
                }
            }
        }

        [Fact]
        public async Task CreateRequestFirstStep_Confirma_KO_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IRegisterService>();
                var result = await service.SaveBasicData(titular, requestData);

                Assert.Null(result);
            }
        }

        [Fact]
        public async Task CreateRequestFullData_One_Holder_PBC_Alert_KO_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IRegisterService>();
                var result = await service.SaveBasicData(titular, requestData);

                Assert.Null(result);
            }
        }

        [Fact]
        public async Task CreateRequestFullData_One_Holder_Person_Public_Alert_KO_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IRegisterService>();
                var result = await service.SaveBasicData(titular, requestData);

                Assert.Null(result);
            }
        }

        [Fact]
        public async Task CreateRequestFullData_One_Holder_One_Coowner_OK_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IRegisterService>();
                var result = await service.SaveBasicData(titular, requestData);

                Assert.NotNull(result);

                var coownerDni = Helpers.Helper.RandomDni();

                var fullData = new RequestFullData
                {
                    RequestId = result.Id,
                    IdInitialProduct = requestData.IdInitialProduct,
                    IdRequestChannel = requestData.IdRequestChannel,
                    Web = true,
                    SignatureType = 1,
                    Applicants = new List<SignUpApplicant>
                    {
                        new SignUpApplicant
                        {
                            BasicData = new ApplicantBasicData
                            {
                                ApplicantType = (int)PersonTypeEnum.Fisica,
                                Dni = titular.BasicData.Dni,
                                Email = titular.BasicData.Email,
                                FirstSurname = titular.BasicData.FirstSurname,
                                IDDocumentType = "DNI",
                                InformationRight = true,
                                MobilePhoneNumber = titular.BasicData.MobilePhoneNumber,
                                Name = titular.BasicData.Name,
                                PhoneNumber = titular.PersonalData.PhoneNumber,
                                RequestApplicantType = (int)ApplicantRoleType.Titular,
                                SecondSurname = titular.BasicData.SecondSurname
                            },
                            PersonalData = new SignUpRequestApplicantPersonalData
                            {
                                Birthday = new DateTime(1985,1,1),
                                BornPlace = "Madrid",
                                Country = 1,
                                Gender = (int)GenderType.Hombre,
                                IDDocumentExpirationDate = new DateTime(2020,1,1),
                                IDDocumentIsPermanent = false,
                                IsResident = true,
                                Nacionality = 1,
                                PhoneNumber = titular.PersonalData.PhoneNumber
                            },
                            ContactData = new List<SignUpAddressData>
                            {
                                new SignUpAddressData
                                {
                                    AddressType = "FiscalAddress",
                                    City = "Madrid",
                                    CountryType = 3,
                                    ViaType = 26,
                                    IdCountry = 1,
                                    Province = "Madrid",
                                    Number = "1",
                                    Name = "Juan de mena",
                                    PostalCode = "28014"
                                }
                            },
                            Countries = new List<SignUpApplicantCountry>
                            {
                                new SignUpApplicantCountry
                                {
                                    CountryId = 1,
                                    CountryTypeId = (int)CountryType.Birth
                                },
                                new SignUpApplicantCountry
                                {
                                    CountryId = 1,
                                    CountryTypeId = (int)CountryType.MainResidence
                                },
                                new SignUpApplicantCountry
                                {
                                    CountryId = 1,
                                    CountryTypeId = (int)CountryType.Nationality
                                }
                            },
                            ApplicantRole = new List<SignUpApplicantRole>
                            {
                                new SignUpApplicantRole
                                {
                                    IdApplicant = titular.BasicData.Dni,
                                    RequestApplicantType = (int)ApplicantRoleType.Titular,
                                    RequestId = result.Id
                                }
                            },
                            ApplicantIDDocuments = new List<SignUpApplicantIDDocument>
                            {
                                new SignUpApplicantIDDocument
                                {
                                    DocumentID = IDDocumentType.NIF.ToString(),
                                    DocumentNumber = titular.BasicData.Dni
                                }
                            },
                            QuestionAnswers = new List<RequestQuestionAnswer>
                            {
                                new RequestQuestionAnswer
                                {
                                    IdQuestion = 21,
                                    IdAnswer = 63
                                },
                                new RequestQuestionAnswer
                                {
                                    IdQuestion = 22,
                                    IdAnswer = 80
                                },
                                new RequestQuestionAnswer
                                {
                                    IdQuestion = 6,
                                    IdAnswer = 4
                                },
                                new RequestQuestionAnswer
                                {
                                    IdQuestion = 8,
                                    IdAnswer = 27
                                },
                                new RequestQuestionAnswer
                                {
                                    IdQuestion = 7,
                                    IdAnswer = 23
                                },
                                new RequestQuestionAnswer
                                {
                                    IdQuestion = 9,
                                    IdAnswer = 33,
                                    OtherAnswer = ""
                                },
                                new RequestQuestionAnswer
                                {
                                    IdQuestion = 23,
                                    IdAnswer = 68
                                },
                                new RequestQuestionAnswer
                                {
                                    IdQuestion = 27,
                                    IdAnswer = 72
                                }

                            }
                        },
                        new SignUpApplicant
                        {
                            BasicData = new ApplicantBasicData
                            {
                                ApplicantType = (int)PersonTypeEnum.Fisica,
                                Dni = coownerDni,
                                Email = "cotitular@cotitular.es",
                                FirstSurname = "cotitular",
                                IDDocumentType = "DNI",
                                InformationRight = true,
                                MobilePhoneNumber = "666666666",
                                Name = "cotitular",
                                RequestApplicantType = (int)ApplicantRoleType.Cotitular,
                                SecondSurname = "cotitular"
                            },
                            PersonalData = new SignUpRequestApplicantPersonalData
                            {
                                Birthday = new DateTime(1985,1,1),
                                BornPlace = "Madrid",
                                Country = 1,
                                Gender = (int)GenderType.Hombre,
                                IDDocumentExpirationDate = new DateTime(2020,1,1),
                                IDDocumentIsPermanent = false,
                                IsResident = true,
                                Nacionality = 1
                            },
                            ContactData = new List<SignUpAddressData>
                            {
                                new SignUpAddressData
                                {
                                    AddressType = "FiscalAddress",
                                    City = "Madrid",
                                    CountryType = 3,
                                    ViaType = 26,
                                    IdCountry = 1,
                                    Province = "Madrid",
                                    Number = "1",
                                    Name = "Juan de mena",
                                    PostalCode = "28014"
                                }
                            },
                            Countries = new List<SignUpApplicantCountry>
                            {
                                new SignUpApplicantCountry
                                {
                                    CountryId = 1,
                                    CountryTypeId = (int)CountryType.Birth
                                },
                                new SignUpApplicantCountry
                                {
                                    CountryId = 1,
                                    CountryTypeId = (int)CountryType.MainResidence
                                },
                                new SignUpApplicantCountry
                                {
                                    CountryId = 1,
                                    CountryTypeId = (int)CountryType.Nationality
                                }
                            },
                            ApplicantRole = new List<SignUpApplicantRole>
                            {
                                new SignUpApplicantRole
                                {
                                    IdApplicant = coownerDni,
                                    RequestApplicantType = (int)ApplicantRoleType.Cotitular,
                                    RequestId = result.Id
                                }
                            },
                            ApplicantIDDocuments = new List<SignUpApplicantIDDocument>
                            {
                                new SignUpApplicantIDDocument
                                {
                                    DocumentID = IDDocumentType.NIF.ToString(),
                                    DocumentNumber = coownerDni
                                }
                            },
                            QuestionAnswers = new List<RequestQuestionAnswer>
                            {
                                new RequestQuestionAnswer
                                {
                                    IdQuestion = 21,
                                    IdAnswer = 63
                                },
                                new RequestQuestionAnswer
                                {
                                    IdQuestion = 22,
                                    IdAnswer = 80
                                },
                                new RequestQuestionAnswer
                                {
                                    IdQuestion = 6,
                                    IdAnswer = 4
                                },
                                new RequestQuestionAnswer
                                {
                                    IdQuestion = 8,
                                    IdAnswer = 27
                                },
                                new RequestQuestionAnswer
                                {
                                    IdQuestion = 7,
                                    IdAnswer = 23
                                },
                                new RequestQuestionAnswer
                                {
                                    IdQuestion = 9,
                                    IdAnswer = 33,
                                    OtherAnswer = ""
                                },
                                new RequestQuestionAnswer
                                {
                                    IdQuestion = 23,
                                    IdAnswer = 68
                                },
                                new RequestQuestionAnswer
                                {
                                    IdQuestion = 27,
                                    IdAnswer = 72
                                }

                            }
                        }
                    },
                    OperationData = new List<SignUpRequestProductOperation>
                    {
                        new SignUpRequestProductOperation
                        {
                            ProductId = 1,
                            Operation = new List<SignUpRequestOperation>
                            {
                                new SignUpRequestOperation
                                {
                                    IdOperationType = 1,
                                    Amount = 7000,
                                    IdWayToPay = 1,
                                    FondoType = true,
                                    IdTransferType = BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request.TransferType.Total,
                                    FondoName = "",
                                    FondoCode = null,
                                    FondoISIN ="",
                                    ManagerCode= "",
                                    ManagerName= "",
                                    PlanName= "",
                                    PlanCode= null,
                                    ParticipantAccount= "",
                                    MonthlyAmount= null,
                                    IBAN= "",
                                    PayerName= "" 
                                }

                            }
                        }
                    }
                };

                var resultFullData = await service.SaveRequestFullData(fullData);

                Assert.True(resultFullData);
            }
        }

        [Fact]
        public async Task CreateRequestFullData_One_Holder_One_Coowner_Exists_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IRegisterService>();
                var result = await service.SaveBasicData(titular, requestData);

                Assert.Null(result);
            }
        }

        [Fact]
        public async Task CreateRequestFullData_One_Holder_One_Coowner_PBC_Alert_KO_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IRegisterService>();
                var result = await service.SaveBasicData(titular, requestData);

                Assert.Null(result);
            }
        }

        [Fact]
        public async Task CreateRequestFullData_One_Holder_One_Coowner_Person_Public_Alert_KO_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IRegisterService>();
                var result = await service.SaveBasicData(titular, requestData);

                Assert.Null(result);
            }
        }

        [Fact]
        public async Task CreateRequestFullData_One_Holder_One_Authorized_OK_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IRegisterService>();
                var result = await service.SaveBasicData(titular, requestData);

                Assert.Null(result);
            }
        }
    }
}