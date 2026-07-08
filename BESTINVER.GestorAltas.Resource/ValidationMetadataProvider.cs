using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Microsoft.Extensions.Localization;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace BESTINVER.GestorAltas
{
    public class ValidationMetadataProvider<TResource> : IValidationMetadataProvider
         where TResource : class, new()
    {
        private readonly IStringLocalizer stringLocalizer;

        public ValidationMetadataProvider(IStringLocalizerFactory factory)
        {
            stringLocalizer = factory.Create<TResource>();
        }

        public void CreateValidationMetadata(ValidationMetadataProviderContext context)
        {
            if (!context.Attributes.OfType<System.ComponentModel.DisplayNameAttribute>().Any())
            {
                context.ValidationMetadata.ValidatorMetadata.Add(new System.ComponentModel.DisplayNameAttribute(context.Key.Name));
            }
            context.Attributes.OfType<ValidationAttribute>().ToList().ForEach(validationAttribute =>
            {
                var name = validationAttribute.GetType()
                .GetProperty("ErrorMessageString", BindingFlags.Instance | BindingFlags.NonPublic)
                .GetValue(validationAttribute)
                .ToString();

                if (validationAttribute.ErrorMessage == null
                    && validationAttribute.ErrorMessageResourceName == null
                    && validationAttribute.ErrorMessageResourceType == null
                    && GetIsLocalized(name))
                {
                    var localizedString = stringLocalizer[name];
                    if (localizedString.Value != name)
                    {
                        validationAttribute.ErrorMessage = name;
                    }
                }
            });
        }

        public bool GetIsLocalized(string name)
        {
            return stringLocalizer.GetAllStrings().Any(x => x.Name.Equals(name, StringComparison.CurrentCultureIgnoreCase));
        }
    }
}