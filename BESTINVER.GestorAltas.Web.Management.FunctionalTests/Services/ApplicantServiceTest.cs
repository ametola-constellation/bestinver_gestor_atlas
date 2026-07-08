using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.FunctionalTests.Builders;
using SimpleInjector.Lifestyles;


namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.Services
{

    public class ApplicantServiceTest : IClassFixture<DependenciesBuilder>
    {
        private readonly DependenciesBuilder dependenciesBuilder;
        public ApplicantServiceTest(DependenciesBuilder dependenciesBuilder)
        {
            this.dependenciesBuilder = dependenciesBuilder.WithContainer().WithDependencies();
        }

        [Fact]
        public async Task GetApplicantByDNI_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IApplicantService>();
                var dni = "70965802S";
                var result = await service.GetApplicantByDNI(dni);
                Assert.True(result != null);
            }
        }

        [Fact]
        public async Task InsertProspectApplicant_NoAddress_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IApplicantService>();

                var applicant = new SignUpApplicant
                {
                    BasicData = new ApplicantBasicData
                    {
                        ApplicantType = (int)ApplicantType.Fisica,
                        Dni = RandomDni(),
                        Email = "pleon@kabel.es",
                        FirstSurname = "Leon",
                        IDDocumentType = "DNI",
                        MobilePhoneNumber = "620536312",
                        Name = "Pedro",
                        SecondSurname = "Gomez"
                    },
                    PersonalData = new SignUpRequestApplicantPersonalData
                    {
                        Gender = (int)GenderType.Hombre
                    }
                };

                var result = await service.Insert(applicant);

                Assert.NotNull(result);
                Assert.Empty(result.ContactData);
            }
        }

        [Fact]
        public async Task InsertProspectApplicant_OnlyFiscalAddress_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IApplicantService>();

                var applicant = new SignUpApplicant
                {
                    BasicData = new ApplicantBasicData
                    {
                        ApplicantType = (int)ApplicantType.Fisica,
                        Dni = RandomDni(),
                        Email = "pleon@kabel.es",
                        FirstSurname = "Leon",
                        IDDocumentType = "DNI",
                        MobilePhoneNumber = "620536312",
                        Name = "Pedro",
                        SecondSurname = "Gomez"
                    },
                    PersonalData = new SignUpRequestApplicantPersonalData
                    {
                        Gender = (int)GenderType.Hombre
                    },
                    ContactData = new List<SignUpAddressData>
                    {
                        new SignUpAddressData
                        {
                            City = "Madrid",
                            AddressType = "FiscalAddress",
                            IdCountry = 1,
                            Name = "plaza de mondariz",
                            Number = "7",
                            PostalCode = "28029",
                            Province = "Madrid",
                            ViaType = 1,
                            CountryType = 2
                        }
                    }
                };

                var result = await service.Insert(applicant);

                Assert.NotNull(result);
                Assert.Equal(result.ContactData[0].Id, result.ContactData[1].Id);
            }
        }

        [Fact]
        public async Task InsertProspectApplicant_FiscalAndPostalAddress_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IApplicantService>();

                var applicant = new SignUpApplicant
                {
                    BasicData = new ApplicantBasicData
                    {
                        ApplicantType = (int)ApplicantType.Fisica,
                        Dni = RandomDni(),
                        Email = "pleon@kabel.es",
                        FirstSurname = "Leon",
                        IDDocumentType = "DNI",
                        MobilePhoneNumber = "620536312",
                        Name = "Pedro",
                        SecondSurname = "Gomez"
                    },
                    PersonalData = new SignUpRequestApplicantPersonalData
                    {
                        Gender = (int)GenderType.Hombre
                    },
                    ContactData = new List<SignUpAddressData>
                    {
                        new SignUpAddressData
                        {
                            City = "Madrid",
                            AddressType = "FiscalAddress",
                            IdCountry = 1,
                            Name = "plaza de mondariz",
                            Number = "7",
                            PostalCode = "28029",
                            Province = "Madrid",
                            ViaType = 1,
                            CountryType = 2
                        },
                        new SignUpAddressData
                        {
                            City = "Madrid",
                            AddressType = "PostalAddress",
                            IdCountry = 1,
                            Name = "melchor fernandez almagro",
                            Number = "29",
                            PostalCode = "28029",
                            Province = "Madrid",
                            ViaType = 1,
                            CountryType = 2
                        }
                    }
                };

                var result = await service.Insert(applicant);

                Assert.NotNull(result);
                Assert.NotEqual(result.ContactData[0].Id, result.ContactData[1].Id);
            }
        }

        [Fact]
        public async Task InsertProspectApplicant_NoAddress_UpdateWithAddress_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IApplicantService>();

                var applicant = new SignUpApplicant
                {
                    BasicData = new ApplicantBasicData
                    {
                        ApplicantType = (int)ApplicantType.Fisica,
                        Dni = RandomDni(),
                        Email = "pleon@kabel.es",
                        FirstSurname = "Leon",
                        IDDocumentType = "DNI",
                        MobilePhoneNumber = "620536312",
                        Name = "Pedro",
                        SecondSurname = "Gomez"
                    },
                    PersonalData = new SignUpRequestApplicantPersonalData
                    {
                        Gender = (int)GenderType.Hombre
                    }
                };

                var result = await service.Insert(applicant);

                Assert.NotNull(result);
                Assert.Empty(result.ContactData);
                
                result.ContactData = new List<SignUpAddressData>
                    {
                        new SignUpAddressData
                        {
                            City = "Madrid",
                            AddressType = "FiscalAddress",
                            IdCountry = 1,
                            Name = "plaza de mondariz",
                            Number = "7",
                            PostalCode = "28029",
                            Province = "Madrid",
                            ViaType = 1,
                            CountryType = 2
                        },
                        new SignUpAddressData
                        {
                            City = "Madrid",
                            AddressType = "PostalAddress",
                            IdCountry = 1,
                            Name = "melchor fernandez almagro",
                            Number = "29",
                            PostalCode = "28029",
                            Province = "Madrid",
                            ViaType = 1,
                            CountryType = 2
                        }
                    };
                var resultUpdate = await service.Update(result);

                Assert.NotNull(resultUpdate);
                Assert.Equal(2, resultUpdate.ContactData.Count);
                Assert.NotEqual(resultUpdate.ContactData[0].Id, resultUpdate.ContactData[2].Id);
            }
        }
        
        [Fact]
        public async Task UpdateProspectApplicant_FiscalAddressEqualsToPostal_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IApplicantService>();

                //Insert prospect
                var applicant = new SignUpApplicant
                {
                    BasicData = new ApplicantBasicData
                    {
                        ApplicantType = (int)ApplicantType.Fisica,
                        Dni = RandomDni(),
                        Email = "pleon@kabel.es",
                        FirstSurname = "Leon",
                        IDDocumentType = "DNI",
                        MobilePhoneNumber = "620536312",
                        Name = "Pedro",
                        SecondSurname = "Gomez"
                    },
                    PersonalData = new SignUpRequestApplicantPersonalData
                    {
                        Gender = (int)GenderType.Hombre
                    },
                };

                await service.Insert(applicant);

                //Update prospect
                var applicantBD = await service.GetApplicantByDNI(applicant.BasicData.Dni);

                applicantBD.Countries = new List<SignUpApplicantCountry>
                    {
                        new SignUpApplicantCountry
                        {
                            CountryId = 1,
                            CountryTypeId = (int)CountryType.Birth
                        },
                        new SignUpApplicantCountry
                        {
                            CountryId = 1,
                            CountryTypeId = (int)CountryType.Nationality
                        },
                        new SignUpApplicantCountry
                        {
                            CountryId = 1,
                            CountryTypeId = (int)CountryType.MainResidence
                        }
                    };

                applicantBD.PersonalData = new SignUpRequestApplicantPersonalData
                {
                    Birthday = new DateTime(1985, 8, 29),
                    BornPlace = "Madrid",
                    Country = 1,
                    Gender = (int)GenderType.Hombre,
                    IDDocumentExpirationDate = new DateTime(2020, 1, 1),
                    IDDocumentIsPermanent = false,
                    IsResident = true,
                    Nacionality = 1
                };

                applicantBD.ContactData = new List<SignUpAddressData>
                    {
                        new SignUpAddressData
                        {
                            AddressType = "FiscalAddress",
                            City = "Madrid",
                            CountryType = (int)CountryType.MainResidence,
                            IdCountry = 1,
                            Name = "Juan de mena",
                            Number = "1",
                            PostalCode = "28029",
                            Province = "Madrid",
                            ViaType = 1
                        }
                    };

                var result = await service.Update(applicantBD);

                Assert.NotNull(result);
                Assert.True(result.ContactData.Count == 2);
                if (result.ContactData.Count == 2)
                    Assert.True(result.ContactData[0].Id == result.ContactData[1].Id);
            }
        }

        [Fact]
        public async Task UpdateProspectApplicant_FiscalAddressDistinctToPostal_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IApplicantService>();

                //Insert prospect
                var applicant = new SignUpApplicant
                {
                    BasicData = new ApplicantBasicData
                    {
                        ApplicantType = (int)ApplicantType.Fisica,
                        Dni = RandomDni(),
                        Email = "pleon@kabel.es",
                        FirstSurname = "Leon",
                        IDDocumentType = "DNI",
                        MobilePhoneNumber = "620536312",
                        Name = "Pedro",
                        SecondSurname = "Gomez"
                    },
                    PersonalData = new SignUpRequestApplicantPersonalData
                    {
                        Gender = (int)GenderType.Hombre
                    },
                };

                await service.Insert(applicant);

                //Update prospect
                var applicantBD = await service.GetApplicantByDNI(applicant.BasicData.Dni);

                applicantBD.Countries = new List<SignUpApplicantCountry>
                    {
                        new SignUpApplicantCountry
                        {
                            CountryId = 1,
                            CountryTypeId = (int)CountryType.Birth
                        },
                        new SignUpApplicantCountry
                        {
                            CountryId = 1,
                            CountryTypeId = (int)CountryType.Nationality
                        },
                        new SignUpApplicantCountry
                        {
                            CountryId = 1,
                            CountryTypeId = (int)CountryType.MainResidence
                        }
                    };

                applicantBD.PersonalData = new SignUpRequestApplicantPersonalData
                {
                    Birthday = new DateTime(1985, 8, 29),
                    BornPlace = "Madrid",
                    Country = 1,
                    Gender = (int)GenderType.Hombre,
                    IDDocumentExpirationDate = new DateTime(2020, 1, 1),
                    IDDocumentIsPermanent = false,
                    IsResident = true,
                    Nacionality = 1
                };

                applicantBD.ContactData = new List<SignUpAddressData>
                    {
                        new SignUpAddressData
                        {
                            AddressType = "FiscalAddress",
                            City = "Madrid",
                            CountryType = (int)CountryType.MainResidence,
                            IdCountry = 1,
                            Name = "Juan de mena",
                            Number = "1",
                            PostalCode = "28029",
                            Province = "Madrid",
                            ViaType = 1
                        },
                        new SignUpAddressData
                        {
                            AddressType = "PostalAddress",
                            City = "Madrid",
                            CountryType = (int)CountryType.MainResidence,
                            IdCountry = 1,
                            Name = "Calle alcala",
                            Number = "1",
                            PostalCode = "28029",
                            Province = "Madrid",
                            ViaType = 1
                        }
                    };

                var result = await service.Update(applicantBD);

                Assert.NotNull(result);
                Assert.True(result.ContactData.Count == 2);
                if (result.ContactData.Count == 2)
                    Assert.True(result.ContactData[0].Id != result.ContactData[1].Id);
            }
        }

        private static string RandomDni()
        {
            Random rnd = new Random(DateTime.Now.Millisecond);
            int dni = rnd.Next(1000, 100000000);
            return $"{dni:00000000}{LetraDNI(dni)}";
        }

        private static string LetraDNI(int dni)
        {
            int indice = dni % 23;
            return "TRWAGMYFPDXBNJZSQVHLCKET"[indice].ToString();
        }
    }
}