using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Web;
using static System.Web.HttpUtility;

namespace BESTINVER.GestorAltas.MicroservicesProxy
{
    public static class ExtensionMethods
    {
        public static bool IsSimple(this Type type)
        {
            var typeInfo = type.GetTypeInfo();
            if (typeInfo.IsGenericType && typeInfo.GetGenericTypeDefinition() == typeof(Nullable<>))
            {
                // nullable type, check if the nested type is simple.
                return IsSimple(typeInfo.GetGenericArguments()[0]);
            }
            return typeInfo.IsPrimitive
              || type.IsEnum
              || type.Equals(typeof(string))
              || type.Equals(typeof(decimal));
        }

        public static Uri BuildUri<T>(this T obj, string absoluteUri, params Expression<Func<T, object>>[] excludes) where T : class
        {
            var uriBuilder = new UriBuilder();
            var excludeObj = excludes.Select(action =>
            {
                if (!(action.Body is MemberExpression excludeExpression))
                {
                    var ubody = (UnaryExpression)action.Body;
                    excludeExpression = ubody.Operand as MemberExpression;
                }

                return excludeExpression.Member as PropertyInfo;
            });
            obj.GetType().GetProperties()
                .Where(prop => !excludeObj.Any(x => x.PropertyType.Name == prop.PropertyType.Name))
            .ToList().ForEach(parrentProp =>
            {
                GetUri(obj, ref absoluteUri, parrentProp, ref uriBuilder, excludeObj);
                var childObj = parrentProp.GetMethod.Invoke(obj, null);
                childObj.GetType().GetProperties().ToList()
                    .ForEach(childProp => GetUri(childObj, ref absoluteUri, childProp, ref uriBuilder, excludeObj));
            });
            uriBuilder.Uri.Segments[0] = string.Empty;

            return uriBuilder.Uri;
        }

        private static void GetUri<T>(T obj, ref string absoluteUri, PropertyInfo prop, ref UriBuilder uriBuilder, IEnumerable<PropertyInfo> excludeObj) where T : class
        {
            var value = prop.GetMethod.Invoke(obj, null);
            if (value != null && !excludeObj.Any(x => x.PropertyType.FullName == prop.PropertyType.FullName) && IsSimple(prop.PropertyType))
            {
                uriBuilder = GetUri(obj, ref absoluteUri, prop);
            }
        }

        public static UriBuilder GetUri<T>(T obj, ref string absoluteUri, PropertyInfo property) where T : class
        {
            UriBuilder uriBuilder;
            var key = property.Name;
            var value = property.GetMethod.Invoke(obj, null).ToString();
            var isPathValue = absoluteUri.Contains($"{{{key}}}");
            if (isPathValue)
            {
                absoluteUri = absoluteUri.Replace($"{{{key}}}", value);
            }

            uriBuilder = new UriBuilder(absoluteUri);
            if (uriBuilder.Path.Contains("//"))
            {
                absoluteUri = absoluteUri.Replace(uriBuilder.Path, uriBuilder.Path.Replace("//", "/"));
                uriBuilder = new UriBuilder(absoluteUri);
            }
            // Parse query string into an HttpValueCollection
            var queryItems = HttpUtility.ParseQueryString(uriBuilder.Query);
            if (!isPathValue)
            {
                queryItems.Add(key, value);
            }

            uriBuilder.Query = queryItems.ToString();
            absoluteUri = uriBuilder.Uri.AbsoluteUri;
            return uriBuilder;
        }

        public static string GetQueryString<T>(this T obj, params Type[] exclude) where T : class
        {
            var properties = obj.AsQueryValues().ToList();

            var complexObjects = from p in obj.GetType().GetProperties()
                                 where p.GetValue(obj, null) != null
                                 && !p.PropertyType.IsSimple()
                                 && !exclude.Contains(p.PropertyType)
                                 select p.GetValue(obj, null);

            complexObjects
                .ToList()
                .ForEach(x => properties.AddRange(x.AsQueryValues()));

            return properties.Count == 0 ? string.Empty : $"?{string.Join("&", properties.ToArray())}";
        }

        private static IEnumerable<string> AsQueryValues(this object obj)
            => from p in obj.GetType().GetProperties()
               where p.GetValue(obj, null) != null
               && p.PropertyType.IsSimple()
               select GetQueryValue(obj, p);

        private static string GetQueryValue<T>(T obj, PropertyInfo p) where T : class
            => p.Name + "=" + UrlEncode(p.GetValue(obj, null)?.ToString());
    }
}