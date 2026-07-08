using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;

namespace BESTINVER.GestorAltas
{
    public interface IHumanizerMetadataProvider : IDisplayMetadataProvider
    {
        bool GetIsLocalized(string name);
    }
}