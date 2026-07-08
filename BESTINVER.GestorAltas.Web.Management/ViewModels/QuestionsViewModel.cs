namespace BESTINVER.GestorAltas.Web.Management.ViewModels
{
    public class QuestionsViewModel
    {
        public BestInver.WebPrivada.Shared.Models.Microservices.Tests.TestQuestion Question { get; set; }

        public string Answer { get; set; }

        public bool AllowEdit { get; set; }
    }
}