using System.Collections;
using System.Reflection;

namespace BESTINVER.GestorAltas.Utilities.Extensions
{
    public static class ReflectionExtensions
    {
        public static object CapitalizeAndRemoveDiacritics(this object obj)
        {
            if (obj == null)
            {
                return obj;
            }

            var objType = obj.GetType();
            var properties = objType.GetProperties();
            foreach (PropertyInfo property in properties)
            {
                var propValue = property.GetValue(obj, null);
                if (propValue is IList elems)
                {
                    for (int i = 0; i < elems.Count; i++)
                    {
                        CapitalizeAndRemoveDiacritics(elems[i]);
                    }
                }
                else if (property.PropertyType.Assembly == objType.Assembly)
                {
#pragma warning disable S1854 // Dead stores should be removed
                    propValue = CapitalizeAndRemoveDiacritics(propValue);
#pragma warning restore S1854 // Dead stores should be removed
                }
                else if (propValue is string)
                {
                    property.SetValue(obj, propValue.ToString().RemoveDiacriticsInString().ToUpperInvariant(), null);
                }
            }
            return obj;
        }
    }
}