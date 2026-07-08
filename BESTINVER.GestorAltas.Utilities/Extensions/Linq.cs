using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;

namespace BESTINVER.GestorAltas.Utilities.Extensions
{
    public static class Linq
    {
        public static IEnumerable<TSource> DistinctBy<TSource, TKey>
           (this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
        {
            var seenKeys = new HashSet<TKey>();
            foreach (TSource element in source)
            {
                if (seenKeys.Add(keySelector(element)))
                {
                    yield return element;
                }
            }
        }

        private static Expression<T> Compose<T>(this Expression<T> first, Expression<T> second, Func<Expression, Expression, Expression> merge)
        {
            // build parameter map (from parameters of second to parameters of first)

            var map = first.Parameters.Select((f, i) => new { f, s = second.Parameters[i] }).ToDictionary(p => p.s, p => p.f);

            // replace parameters in the second lambda expression with parameters from the first

            var secondBody = ParameterRebinder.ReplaceParameters(map, second.Body);

            // apply composition of lambda expression bodies to parameters from the first expression

            return Expression.Lambda<T>(merge(first.Body, secondBody), first.Parameters);
        }

        public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> first, Expression<Func<T, bool>> second)
        {
            return first.Compose(second, Expression.And);
        }

        public static Expression<Func<T, bool>> Or<T>(this Expression<Func<T, bool>> first, Expression<Func<T, bool>> second)
        {
            return first.Compose(second, Expression.Or);
        }

        public static string RemoveDiacritics(this string s)
        {
            return s.RemoveDiacriticsInString();
        }

        public static T Clone<T>(this T source) where T : class
        {
#if NET6_0
            if (!typeof(T).IsSerializable)
            {
                throw new ArgumentException("The type must be serializable.", nameof(source));
            }
#endif

            // Don't serialize a null object, simply return the default for that object
            if (source is null)
            {
                return default(T);
            }


            Stream stream = new MemoryStream();
            using (stream)
            {
                string jsonSerialize = JsonConvert.SerializeObject(source);
                byte[] bytesSerialize = Encoding.UTF8.GetBytes(jsonSerialize);
                stream.Write(bytesSerialize, 0, bytesSerialize.Length);
                stream.Position = 0;

                byte[] bytesDeserialize = new byte[stream.Length];
                stream.Read(bytesDeserialize, 0, bytesDeserialize.Length);
                string jsonDeserialize = Encoding.UTF8.GetString(bytesDeserialize);
                return JsonConvert.DeserializeObject<T>(jsonDeserialize);

            }
        }

        public static IEnumerable<Tuple<string, object, object>> GetDifferences<T>(this T obj1, T obj2)
        {
            var properties = typeof(T).GetProperties();
            var changes = new List<Tuple<string, object, object>>();

            foreach (PropertyInfo pi in properties)
            {
                var value1 = typeof(T).GetProperty(pi.Name).GetValue(obj1, null);
                var value2 = typeof(T).GetProperty(pi.Name).GetValue(obj2, null);

                if (value1 != value2 && (value1?.Equals(value2) != true))
                {
                    changes.Add(new Tuple<string, object, object>(pi.Name, value1, value2));
                }
            }
            return changes;
        }
    }
}