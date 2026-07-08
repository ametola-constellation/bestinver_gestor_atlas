using AutoMapper;
using BESTINVER.GestorAltas.Domain;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using BESTINVER.GestorAltas.Web.Management.Controllers;
using BESTINVER.GestorAltas.Web.Management.Models;
using BESTINVER.GestorAltas.Web.Management.Profiles;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.ControllersV2
{
    public class DetailsControllerTests : BaseTest
    {
        protected readonly IMapper mapper;
        private DetailsController detailsController { get; }

        public DetailsControllerTests()
        {
            string fileAppSettingsJson = $"{System.Environment.CurrentDirectory.Replace("\\bin\\Debug\\net6.0", string.Empty)}\\appsettings.json";


            var config = new ConfigurationBuilder()
                .AddJsonFile(fileAppSettingsJson)
                .Build();

            mapper = AutoMapperConfig.GetConfiguration([
                typeof(TableResultProfile).Assembly
            ]).CreateMapper();

            var requestStoreStateContext = new RequestStoreStateContext<RequestValidation>();
            var requestStateFactory = new RequestStateFactory(Mapper, requestStoreStateContext);
            var requestService = new RequestService(ApiWebPrivadaHelper, requestStateFactory);
            var alertService = new AlertService(ApiWebPrivadaHelper, requestService, Mapper);

            var testService = new TestService(ApiWebPrivadaHelper);
            var singupService = new SignUpService(ApiWebPrivadaHelper);
            var signaturesService = new SignaturesService(ApiWebPrivadaHelper);
            var loggerFactory = new LoggerFactory();
            var stringLocalizerAux = new StringLocalizerFactory(LocalizationOptions, loggerFactory);
            var stringLocalizer = (IStringLocalizer<Resource.Localization.Strings>)new StringLocalizerFactory<Resource.Localization.Strings>(stringLocalizerAux).Create(typeof(Resource.Localization.Strings));

            var applicantService = new ApplicantService(ApiWebPrivadaHelper);
            var signUpService = new SignUpService(ApiWebPrivadaHelper);
            var sendMailService = new SendMailService(ApiWebPrivadaHelper);
            var amlService = new AmlService(ApiWebPrivadaHelper);
            var customersService = new CustomersService(ApiWebPrivadaHelper);
            var representativesService = new RepresentativesService(ApiWebPrivadaHelper);
            var productService = new ProductService(ApiWebPrivadaHelper);
            var sharedService = new SharedService(ApiWebPrivadaHelper);
            var registerService = new RegisterService(applicantService, singupService, AppSettings.Value, customersService, alertService, requestService, testService, Mapper, signaturesService, sendMailService, signUpService, amlService, productService, sharedService, representativesService, ConfigureLogger<RegisterService>());
            var portfoliosService = new PortfoliosService(ApiWebPrivadaHelper);
            var operationService = new OperationsService(ApiWebPrivadaHelper);

            detailsController = new DetailsController(alertService,
                                                      requestService,
                                                      testService,
                                                      singupService,
                                                      signaturesService,
                                                      ConfigureLogger<DetailsController>(),
                                                      Mapper,
                                                      AppSettings,
                                                      stringLocalizer,
                                                      registerService,
                                                      applicantService,
                                                      signUpService,
                                                      sendMailService,
                                                      amlService,
                                                      customersService,
                                                      representativesService,
                                                      productService,
                                                      portfoliosService,
                                                      operationService);
        }

        [Fact]
        public async Task IndexTest()
        {
            // Act
            var result = await detailsController.Index(Guid.NewGuid());

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async Task GetPeriodicOperationDetailsTest()
        {

            // Arrange
            var idRequest = Guid.Parse("CAE7571E-3D64-4E46-9ACB-811C69CA9757");
            var idOperation = 30863;
            var idProduct = 1;
            bool sendPSD2 = false;

            // Act
            var result = await this.detailsController.GetPeriodicOperationDetails(idRequest, idOperation, idProduct, sendPSD2);
            var partialViewResult = result as PartialViewResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(partialViewResult);
            Assert.NotNull(partialViewResult.ViewData);
        }

        [Fact]
        public async Task UpdatePeriodicOperationTest()
        {

            // Arrange
            var model = new UpdateRequestPeriodicOperationModel()
            {
                RequestId = Guid.Parse("4A00CA6A-83AA-4045-8B6D-FFF70D5139F0"),
                Id = 25420,
                MonthlyAmount = 0,
                IBAN = "",
                InitialDay = 0,
                InitialMonth = 1,
                InitialYear = 2024,
                IdPeriodicity = 1,
                Signer = ""
            };


            // Act
            var result = await this.detailsController.UpdatePeriodicOperation(model);
            var redirectResult = result as RedirectToActionResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(redirectResult);
            Assert.NotNull(redirectResult.ActionName);
            Assert.NotEmpty(redirectResult.ActionName);
        }

        //[Fact]
        internal async Task InsertPeriodicOperationTest()
        {

            // Arrange
            var model = new UpdateRequestPeriodicOperationModel()
            {
                RequestId = Guid.Parse("4A00CA6A-83AA-4045-8B6D-FFF70D5139F0"),
                Id = 25420,
                MonthlyAmount = 0,
                IBAN = "",
                InitialDay = 0,
                InitialMonth = 1,
                InitialYear = 2024,
                IdPeriodicity = 1,
                Signer = "43520338Z"
            };

            // Act
            var result = await this.detailsController.InsertPeriodicOperation(model);
            var redirectResult = result as RedirectToActionResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(redirectResult);
            Assert.NotNull(redirectResult.ActionName);
            Assert.NotEmpty(redirectResult.ActionName);
        }
    }
}
