namespace BESTINVER.GestorAltas.Web.Management.Common
{
    public interface IIdentityServerSection
    {
        string Authority { get; set; }
        string ClientId { get; set; }
        string ClientSecret { get; set; }
        string Scopes { get; set; }
    }
}