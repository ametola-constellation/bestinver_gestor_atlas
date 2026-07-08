namespace BESTINVER.GestorAltas.Web.Management.Models.Remediacion
{
    public class RemediacionRequestStatusModel
    {
        public int Id { get; set; }
        public System.DateTime Created { get; set; }
        public int StatusId { get; set; }
        public string StatusDescription { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
    }
}