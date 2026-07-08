using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    using ConvenientProduct = BestInver.WebPrivada.Shared.Models.Microservices.Tests.ConvenientProduct;
    using ConvenientResponse = BESTINVER.GestorAltas.Web.Models.Tests.ConvenientResponse;
    using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
    using BestInver.WebPrivada.Shared.Models.Microservices.Tests;
    using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
    using BestInver.WebPrivada.Shared.Models.Middleware.MiddleOffice;
    using System.Linq;

    public class TestService : ITestService
    {
        private readonly IApiWebPrivadaHelper api;

        private const string testBaseAddress = "/api/tests";

        public TestService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public async Task<IEnumerable<Test>> GetTestAnswers(Guid requestId)
        {
            var payload = new
            {
                requestId = requestId.ToString()
            };
            var result = await api.PostWebAPI<IEnumerable<Test>, object>($"{testBaseAddress}/search", payload).ConfigureAwait(false);
            return result;
        }

        public async Task<IEnumerable<Question>> GetQuestions(int requestApplicantType, int applicantType, int? product = null)
        {
            var model = new QuestionAnswerMOSearch
            {
                ApplicantRoleType = (BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.ApplicantRoleType)requestApplicantType,
                ApplicantType = (BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.ApplicantType)applicantType,
                RequestChannelType = BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.RequestChannelType.Publica,
                ProductId = product
            };

            var result = await api.PostWebAPI<IEnumerable<Question>, QuestionAnswerMOSearch>($"{testBaseAddress}/questions", model).ConfigureAwait(false);
            return result;
        }

        public Task<IEnumerable<Test>> InsertApplicantTest(IEnumerable<Test> test)
            => api.PostWebAPI<IEnumerable<Test>, IEnumerable<Test>>(testBaseAddress, test);

        public Task<IEnumerable<Test>> UpdateTestQuestion(IEnumerable<Test> test)
            => api.PutWebAPI<IEnumerable<Test>>(testBaseAddress, test);

        public async Task<bool> AskForRequiredRealOwner(RequestRequiredRealOwner model)
        {
            try
            {
                return await api.PostWebAPI<bool, RequestRequiredRealOwner>($"{testBaseAddress}/AskForRequiredRealOwner", model);
            }
            catch
            {
                return await Task.FromResult(false);
            }
        }

        public Task<IEnumerable<Test>> RemoveQuestion(IEnumerable<Test> test)
            => api.DeleteWebAPI<IEnumerable<Test>, IEnumerable<Test>>(testBaseAddress, test);

        public Task<IEnumerable<Test>> ResetApplicantTest(IEnumerable<Test> test)
            => api.PostWebAPI<IEnumerable<Test>, IEnumerable<Test>>($"{testBaseAddress}/reset", test);

        public Task<ConvenientProduct> checkconvenience(ConvenienceRequest model)
            => api.PostWebAPI<ConvenientProduct, ConvenienceRequest>($"{testBaseAddress}/checkconvenience", model);
        public Task<ConvenientResponse> Convenience(string customerId, int productId)
            => api.GetWebAPI<ConvenientResponse>($"{testBaseAddress}/convenience/{customerId}/{productId}");

    }
}