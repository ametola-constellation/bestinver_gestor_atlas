using BestInver.WebPrivada.Shared.Models.Services.Signatures.Request;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.FunctionalTests.Builders;
using BESTINVER.GestorAltas.Web.Models;
using SimpleInjector.Lifestyles;
using System;
using System.Threading.Tasks;
using Xunit;


namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.Services
{
    public class SignatureServiceTest : IClassFixture<DependenciesBuilder>
    {
        private readonly DependenciesBuilder dependenciesBuilder;

        public SignatureServiceTest(DependenciesBuilder dependenciesBuilder)
        {
            this.dependenciesBuilder = dependenciesBuilder.WithContainer().WithDependencies();
        }

        [Fact]
        public async Task GenerateDocuments_Test()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<IRequestService>();
                var serviceDoc = container.GetInstance<ISignaturesService>();

                var requestID = new Guid("d925da32-b8be-4866-a9df-b863946576f1");
                var request = await service.GetRequest(requestID);

                var signUpRequest = new SignRequest
                {
                    Request = request
                };

                if (request != null)
                {
                    var docs = await serviceDoc.GetEcerticDocuments(signUpRequest);
                    Assert.True(docs != null);
                }

                Assert.True(request != null);
            }
        }
       
        [Fact]
        public async Task RestoreDocumentsSignatureTest()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var service = container.GetInstance<RegisterService>();
                var model = new SignatureRestore
                {
                    RequestId = "376df2f2-635b-48fc-b440-376a3fa24b1a",
                    Dni = "84597475W"
                };

                var result = await service.RestoreDocumentsSignature(model);

                var resultExpected = new PdfDocumentsApplicantData
                {
                };

                Assert.NotEqual(result, resultExpected);
            }
        }
    }
} 