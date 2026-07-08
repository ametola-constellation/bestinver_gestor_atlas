namespace BESTINVER.GestorAltas.Domain.Interfaces
{
    public interface ICustomError
    {
        string Confirma { get; set; }
        string ExistingApplicant { get; set; }
        string ExistingRD { get; set; }
        string Generic { get; set; }
        string RequestWithAlerts { get; set; }
    }
}