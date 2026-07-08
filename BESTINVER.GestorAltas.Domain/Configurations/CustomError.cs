using BESTINVER.GestorAltas.Domain.Interfaces;

namespace BESTINVER.GestorAltas.Domain.Configurations
{
    public class CustomErrors : ICustomError
    {
        public string Generic { get; set; }
        public string ExistingApplicant { get; set; }
        public string Confirma { get; set; }
        public string ExistingRD { get; set; }
        public string RequestWithAlerts { get; set; }
    }
}