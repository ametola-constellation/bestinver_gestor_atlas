using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using BESTINVER.GestorAltas;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class ModelBindingMessageProviderExtensions
    {
        public static ServiceProvider AddModelBindingMessageProvider<TResource>(this IServiceCollection services, MvcOptions options)
           where TResource : class, new()
        {
            var serviceProvider = services.BuildServiceProvider();

            var factory = serviceProvider.GetService<IStringLocalizerFactory>();
            var localizer = factory.Create<TResource>();
            options.ModelBindingMessageProvider
            .SetValueMustBeANumberAccessor((name) => localizer["The field {0} must be a number.", name]);

            options.ModelBindingMessageProvider
            .SetMissingBindRequiredValueAccessor((name) => localizer["A value for the '{0}' property was not provided.", name]);

            options.ModelBindingMessageProvider
            .SetAttemptedValueIsInvalidAccessor((name, accessor) => localizer["The value '{0}' is not valid for {1}.", name, accessor]);

            options.ModelBindingMessageProvider
            .SetMissingKeyOrValueAccessor(() => localizer["A value is required."]);

            options.ModelBindingMessageProvider
            .SetValueMustNotBeNullAccessor((x) => localizer["Null value is invalid.", x]);

            options.ModelBindingMessageProvider
            .SetUnknownValueIsInvalidAccessor((name) => localizer["The supplied value is invalid for {0}.", name]);
            return serviceProvider;
        }
    }
}