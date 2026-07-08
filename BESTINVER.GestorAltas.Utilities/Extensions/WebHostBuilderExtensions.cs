using Azure.Core;
using Azure.Identity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using System;

namespace BESTINVER.GestorAltas.Utilities.Extensions
{
    public static class WebHostBuilderExtensions
    {
        public static IWebHostBuilder ConfigureAppConfigurationBst(this IWebHostBuilder hostBuilder, string appConfigConnectionStringKey, string refreshKey, TimeSpan? cacheExpiration = null)
        {
            Func<IConfiguration, TokenCredential> getCredential = (config) =>
            {
                var userManagedIdentityClientId = Environment.GetEnvironmentVariable("USER_IDENTITY_ID");
                return new ManagedIdentityCredential(userManagedIdentityClientId);
            };
            return ConfigureAppConfiguration(hostBuilder, appConfigConnectionStringKey, refreshKey, cacheExpiration, getCredential);
        }

        public static IWebHostBuilder ConfigureAppConfigurationBstDebug(this IWebHostBuilder hostBuilder, string appConfigConnectionStringKey, string tenantIdKey, string refreshKey, TimeSpan? cacheExpiration = null)
        {
            Func<IConfiguration, TokenCredential> getCredential = (config) => GetAzureCredentials(config[tenantIdKey]); ;
            return ConfigureAppConfiguration(hostBuilder, appConfigConnectionStringKey, refreshKey, cacheExpiration, getCredential);
        }

        private static IWebHostBuilder ConfigureAppConfiguration(IWebHostBuilder hostBuilder, string appConfigConnectionStringKey, string refreshKey, TimeSpan? cacheExpiration, Func<IConfiguration, TokenCredential> getCredential)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            var appConfigLabels = Environment.GetEnvironmentVariable("APP_CONFIG_LABELS");
            var refreshAppConfigMinutesString = Environment.GetEnvironmentVariable("RefreshAppConfigMinutes");
            int refreshAppConfigMinutesDefault = 15;

            return hostBuilder.ConfigureAppConfiguration(config =>
            {
                var settings = config.Build();
                var connection = settings.GetConnectionString(appConfigConnectionStringKey);
                config.AddAzureAppConfiguration(options =>
                {
                    var defaultOptions = options.Connect(connection)
                    .Select(KeyFilter.Any, LabelFilter.Null)
                    .Select(KeyFilter.Any, environment);

                    ApplySelectLabels(defaultOptions, appConfigLabels);

                    defaultOptions.ConfigureRefresh(refreshOptions =>
                    {
                        // When this value changes, on the next refresh operation, the config will update all modified configs since it was last refreshed.
                        refreshOptions.Register(refreshKey, label: environment, refreshAll: true);
                        // Set a timeout for the cache so that it will poll the azure config every X timespan.                        
                        if (int.TryParse(refreshAppConfigMinutesString, out var refreshAppConfigMinutes))
                        {
                            refreshAppConfigMinutesDefault = refreshAppConfigMinutes;
                        }
                        cacheExpiration ??= TimeSpan.FromMinutes(refreshAppConfigMinutesDefault);
                        refreshOptions.SetCacheExpiration(cacheExpiration.Value);
                    })
                    .ConfigureKeyVault(kv =>
                    {
                        var credential = getCredential(settings);
                        kv.SetCredential(credential);
                    })
                    .UseFeatureFlags();
                });
            });
        }

        private static TokenCredential GetAzureCredentials(string tenantId)
        {
            return new DefaultAzureCredential(
                new DefaultAzureCredentialOptions
                {
                    ExcludeInteractiveBrowserCredential = true,
                    ExcludeVisualStudioCodeCredential = false,
                    ExcludeVisualStudioCredential = false,
                    ExcludeSharedTokenCacheCredential = true,
                    ExcludeAzureCliCredential = false,
                    ExcludeManagedIdentityCredential = false,
                    Retry = {
                    MaxRetries = 2,
                        NetworkTimeout = TimeSpan.FromSeconds(5),
                        MaxDelay = TimeSpan.FromSeconds(5)
                            },
                    VisualStudioCodeTenantId = tenantId,
                    VisualStudioTenantId = tenantId
                }
            );
        }

        private static void ApplySelectLabels(AzureAppConfigurationOptions defaultOptions, string appConfigLabels)
        {
            if (!string.IsNullOrEmpty(appConfigLabels))
            {
                if (appConfigLabels.IndexOfAny([',', ';']) != -1)
                {
                    var labels = appConfigLabels.Split(new char[] { ',', ';' });
                    foreach (var label in labels)
                    {
                        defaultOptions.Select(KeyFilter.Any, label);
                    }
                }
                else
                {
                    defaultOptions.Select(KeyFilter.Any, appConfigLabels);
                }
            }
        }
    }

}
