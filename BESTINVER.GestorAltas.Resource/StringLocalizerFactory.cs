using BESTINVER.GestorAltas.Resource.Localization;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;

namespace BESTINVER.GestorAltas.Web
{
    public class StringLocalizerFactory : ResourceManagerStringLocalizerFactory
    {
        public StringLocalizerFactory(IOptions<LocalizationOptions> localizationOptions, ILoggerFactory loggerFactory) : base(localizationOptions, loggerFactory)
        {
        }
    }

    public class StringLocalizerFactory<TResource> : IStringLocalizerFactory
       where TResource : class, new()
    {
        private readonly StringLocalizerFactory stringLocalizerFactory;

        public StringLocalizerFactory(StringLocalizerFactory stringLocalizerFactory)
        {
            this.stringLocalizerFactory = stringLocalizerFactory;
        }

        public IStringLocalizer Create(Type resourceSource)
        {
            if (resourceSource == typeof(Strings))
            {
                return stringLocalizerFactory.Create(Activator.CreateInstance(resourceSource));
            }
            return stringLocalizerFactory.Create(resourceSource);
        }

        public IStringLocalizer Create(string baseName, string location)
        {
            return stringLocalizerFactory.Create<TResource>();
        }
    }
}