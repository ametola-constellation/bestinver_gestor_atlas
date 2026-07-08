using System;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Text;

namespace BESTINVER.GestorAltas.Utilities.Extensions
{
    public static class StringExtensions
    {
        public static string RemoveDiacriticsInString(this string text)
        {
            char[] excludedChars = { 'Ñ', 'ñ' };

            var normalizedString = text.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (char n in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(n);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(n);
                }
            }

            var result = new StringBuilder(stringBuilder.ToString().Normalize(NormalizationForm.FormC));

            for (int i = 0; i < result.Length; i++)
            {
                char t = text[i];

                if (excludedChars.Contains(t))
                {
                    result[i] = t;
                }
            }

            return result.ToString();
        }

        public static T StringToEnum<T>(this string name)
        {
            var type = typeof(T);
            if (Nullable.GetUnderlyingType(type) != null)
            {
                type = Nullable.GetUnderlyingType(type);
            }

            if (!type.IsEnum)
            {
                throw new InvalidOperationException();
            }

            return (T)Enum.Parse(type, name);
        }

        public static T DescriptionStringToEnum<T>(this string description)
        {
            var type = typeof(T);
            if (Nullable.GetUnderlyingType(type) != null)
            {
                type = Nullable.GetUnderlyingType(type);
            }

            if (!type.IsEnum)
            {
                throw new InvalidOperationException();
            }

            foreach (var field in type.GetFields())
            {
                if (Attribute.GetCustomAttribute(field,
                    typeof(DescriptionAttribute)) is DescriptionAttribute attribute)
                {
                    if (attribute.Description == description)
                    {
                        return (T)field.GetValue(null);
                    }
                }
                else
                {
                    if (field.Name == description)
                    {
                        return (T)field.GetValue(null);
                    }
                }
            }
            throw new ArgumentException("Not found.", nameof(description));
        }

        public static string ToDescriptionString<T>(this T value)
        {
            if (System.Collections.Generic.EqualityComparer<T>.Default.Equals(value, default(T)))
            {
                return null;
            }

            var fi = value.GetType().GetField(value.ToString());

            var attributes =
                (DescriptionAttribute[])fi.GetCustomAttributes(
                typeof(DescriptionAttribute),
                false);

            if (attributes?.Length > 0)
            {
                return attributes[0].Description;
            }
            else
            {
                return value.ToString();
            }
        }

        public static int? ToNullableInt(this string s)
        {
            if (int.TryParse(s, out int i))
            {
                return i;
            }

            return null;
        }

        public static string JoinRemoveEmpties(this string separator, params string[] values)
        {
            string result = string.Empty;
            if (values != null)
            {
                result = string.Join(separator, (values).Where(s => !string.IsNullOrEmpty(s)));
            }
            return result;
        }

        public static string StripPrefix(this string text, string prefix)
        {
            return string.IsNullOrEmpty(text) ? text : (text.StartsWith(prefix) ? text.Substring(prefix.Length) : text);
        }
    }
}