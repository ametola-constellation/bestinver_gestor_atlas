using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Microsoft.Extensions.Localization;

namespace BESTINVER.GestorAltas
{
    public class HumanizerMetadataProvider<TResource> : IHumanizerMetadataProvider where TResource : class, new()
    {
        private readonly IStringLocalizer stringLocalizer;

        public HumanizerMetadataProvider(IStringLocalizerFactory factory)
        {
            stringLocalizer = factory.Create<TResource>();
        }

        public void CreateDisplayMetadata(DisplayMetadataProviderContext context)
        {
            //var propertyAttributes = context.Attributes;
            //var modelMetadata = context.DisplayMetadata;
            //var propertyName = context.Key.Name;

            //if (IsTransformRequired(propertyName, modelMetadata, propertyAttributes))
            //{
            //    var value = propertyName.Humanize().Transform(To.TitleCase);
            //    modelMetadata.DisplayName = () => value;
            //}
        }

        public bool GetIsLocalized(string name)
        {
            return stringLocalizer.GetAllStrings().Any(x => x.Name.Equals(name, StringComparison.CurrentCultureIgnoreCase));
        }

        private bool IsTransformRequired(string propertyName, DisplayMetadata modelMetadata, IReadOnlyList<object> propertyAttributes)
        {
            if (propertyAttributes.OfType<Microsoft.AspNetCore.Mvc.ViewFeatures.ViewContextAttribute>().Any()
                || propertyAttributes.OfType<Microsoft.AspNetCore.Mvc.ViewFeatures.SaveTempDataAttribute>().Any()
                || propertyAttributes.OfType<Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionaryAttribute>().Any())
            {
                return false;
            }
            if (!string.IsNullOrEmpty(modelMetadata.SimpleDisplayProperty))
                return false;

            //var isNotLocalized = !GetIsLocalized(propertyName);
            if (propertyAttributes.OfType<DisplayNameAttribute>().Any())
                return false;

            if (propertyAttributes.OfType<DisplayAttribute>().Any())
                return false;

            if (string.IsNullOrEmpty(propertyName))
                return false;

            return true;
        }
    }
}