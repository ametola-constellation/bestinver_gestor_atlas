using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BESTINVER.Wordpress.WS.HealthChecks
{
    /// <summary>
    /// 
    /// </summary>
    public class StartupAndReadyHealthCheck : IHealthCheck
    {
        private static bool isWarmedUp = false;
        private readonly IServiceCollection _services;
        private readonly IServiceProvider _provider;
        private readonly ILogger<StartupAndReadyHealthCheck> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly HealthCheckService _healthCheckService;


        /// <summary>
        /// 
        /// </summary>
        /// <param name="services"></param>
        /// <param name="provider"></param>
        /// <param name="logger"></param>
        /// <param name="httpContextAccessor"></param>        
        /// <param name="healthCheckService"></param>
        public StartupAndReadyHealthCheck(
             IServiceCollection services, IServiceProvider provider,
             ILogger<StartupAndReadyHealthCheck> logger,
             IHttpContextAccessor httpContextAccessor,
             HealthCheckService healthCheckService)
        {
            _services = services;
            _provider = provider;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
            _healthCheckService = healthCheckService;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                if (!isWarmedUp)
                {
                    await Warmup(cancellationToken);
                    if (isWarmedUp)
                    {
                        return HealthCheckResult.Healthy("The startup task has completed.");
                    }
                }

                //HealthCheks de los servicios inyectados menos este mismo de ready.
                var report = await _healthCheckService.CheckHealthAsync(x => !x.Tags.Contains("ready"), cancellationToken);
                return report.Status == HealthStatus.Healthy ? HealthCheckResult.Healthy("The startup task has completed.") :
                                        HealthCheckResult.Unhealthy($"That startup task fails.");
            }
            catch (Exception ex)
            {
                return HealthCheckResult.Unhealthy($"That startup task fails with error {ex}.");
            }
        }

        private async Task Warmup(CancellationToken cancellationToken)
        {
            //Caliento la instanciacion de todos los servicios
            using (var scope = _provider.CreateScope())
            {
                foreach (var singleton in GetServices(_services))
                {
                    try
                    {
                        scope.ServiceProvider.GetServices(singleton);
                    }
                    catch
                    {
                        _logger.LogWarning("El servicio {FullName} no se ha podido instanciar.", singleton.FullName);
                    }
                }
            }

            isWarmedUp = true;
            await Task.CompletedTask;

        }
        private static IEnumerable<Type> GetServices(IServiceCollection services)
        {
            return services
                .Where(descriptor => descriptor.ServiceType.ContainsGenericParameters == false)
                .Select(descriptor => descriptor.ServiceType)
                .Distinct();
        }
        private string GetFullUrl(string relativeUrl) =>
            $"{_httpContextAccessor?.HttpContext?.Request.Scheme}://{_httpContextAccessor?.HttpContext?.Request.Host}{relativeUrl}";
    }
}
