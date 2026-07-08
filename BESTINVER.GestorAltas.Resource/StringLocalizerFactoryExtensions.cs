using BESTINVER.GestorAltas.Web;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc.Localization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using System.Collections.Generic;
using System.Globalization;
using System.Reflection;

namespace BESTINVER.GestorAltas
{
    public static class StringLocalizerFactoryExtensions
    {
        public static IStringLocalizer Create<TResource>(this IStringLocalizerFactory factory)
             where TResource : class, new()
        {
            return factory.Create(new TResource());
        }

        public static IStringLocalizer Create(this IStringLocalizerFactory factory, object resource)

        {
            var assemblyName = new AssemblyName(resource.GetType().GetTypeInfo().Assembly.FullName);
            return factory.Create(resource.GetType().Name, assemblyName.Name);
        }

        public static void AddSharedLocalization<TResource>(this IServiceCollection services)
            where TResource : class, new()
        {
            services.AddSingleton<StringLocalizerFactory, StringLocalizerFactory>();
            services.AddSingleton<IStringLocalizerFactory, StringLocalizerFactory<TResource>>();
            services.AddSingleton((x) => x.GetService<IStringLocalizerFactory>().Create<TResource>());
            services.AddSingleton((x) => x.GetService<IHtmlLocalizerFactory>().Create(new TResource().GetType()));
            services.AddLocalization(x => x.ResourcesPath = "Localization");
        }

        public static void ConfigureRequestLocalizationOptions(this IServiceCollection services)
        {
            // Configure supported cultures and localization options
            services.Configure<RequestLocalizationOptions>(options =>
            {
                var supportedCultures = new[]
                {
                    new CultureInfo("es-ES"),
                    new CultureInfo("en-US"),
                    new CultureInfo("en-GB")
                };

                options.DefaultRequestCulture = new RequestCulture("es-ES", "es-ES");
                // Formatting numbers, dates, etc.
                options.SupportedCultures = supportedCultures;
                // UI strings that we have localized.
                options.SupportedUICultures = supportedCultures;
                options.RequestCultureProviders.Clear();
                options.RequestCultureProviders = new List<IRequestCultureProvider> {
                    new CookieRequestCultureProvider
                    {
                        CookieName = CookieRequestCultureProvider.DefaultCookieName,
                        Options = options
                    }
                };
            });
        }
    }
}