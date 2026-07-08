using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Public.Services
{
    public interface ICallLimitingService
    {
        Task<bool> IsRequestAllowedAsync(string key, TimeSpan expiration);
    }

    public class CallLimitingService : ICallLimitingService
    {
        private readonly IDistributedCache _cache;
        private const string CallLimitPrefix = "CallLimit_";

        public CallLimitingService(IDistributedCache cache)
        {
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        }

        // Comprueba si una llamada está permitida.
        public Task<bool> IsRequestAllowedAsync(string key, TimeSpan expiration)
        {
            ValidateIsRequestAllowedParameters(key);
            return IsRequestAllowedInternalAsync(key, expiration);
        }

        private static void ValidateIsRequestAllowedParameters(string key)
        {
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentException("La clave no puede ser nula o vacía", nameof(key));
            }
        }

        private async Task<bool> IsRequestAllowedInternalAsync(string key, TimeSpan expiration)
        {
            var cacheKey = $"{CallLimitPrefix}{key}";
            var cachedValue = await _cache.GetStringAsync(cacheKey);

            // Si la clave existe, la petición está bloqueada.
            if (!string.IsNullOrEmpty(cachedValue))
            {
                return false;
            }

            // Añade la clave a la caché con la expiración.
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiration
            };

            // El segundo parámetro no se usa, pero es obligatorio para SetStringAsync.
            await _cache.SetStringAsync(cacheKey, key, options);
            return true;
        }
    }
}
