using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Management.ViewModels
{
    public class ApplicantTestsViewModel
    {
        public BestInver.WebPrivada.Shared.Models.Microservices.Tests.TestUser User { get; set; }
        public IEnumerable<QuestionsViewModel> Questions { get; internal set; }
    }

    public class User : BestInver.WebPrivada.Shared.Models.Microservices.Tests.TestUser
    {
        public int? RDCode { get; set; }
    }
}