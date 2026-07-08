using ConvenientProduct = BestInver.WebPrivada.Shared.Models.Microservices.Tests.ConvenientProduct;
using ConvenientResponse = BESTINVER.GestorAltas.Web.Models.Tests.ConvenientResponse;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface ITestService
    {
        Task<IEnumerable<Test>> GetTestAnswers(Guid requestId);

        Task<IEnumerable<Question>> GetQuestions(int requestApplicantType, int applicantType, int? product = null);

        Task<IEnumerable<Test>> InsertApplicantTest(IEnumerable<Test> test);

        Task<IEnumerable<Test>> UpdateTestQuestion(IEnumerable<Test> test);

        Task<bool> AskForRequiredRealOwner(RequestRequiredRealOwner model);

        Task<IEnumerable<Test>> RemoveQuestion(IEnumerable<Test> test);

        Task<IEnumerable<Test>> ResetApplicantTest(IEnumerable<Test> test);

        Task<ConvenientProduct> checkconvenience(ConvenienceRequest model);
        Task<ConvenientResponse> Convenience(string customerId, int productId);
    }
}