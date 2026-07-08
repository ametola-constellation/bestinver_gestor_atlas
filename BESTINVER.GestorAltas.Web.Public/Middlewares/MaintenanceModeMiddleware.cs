using Microsoft.AspNetCore.Http;
using Microsoft.FeatureManagement;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Public.Middlewares
{
    public class MaintenanceModeMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IFeatureManager _featureManager;
        private const string _maintenanceHtmlPage = "app_offline.htm";

        public MaintenanceModeMiddleware(RequestDelegate next, IFeatureManager featureManager)
        {
            _next = next;
            _featureManager = featureManager;
        }

        public async Task Invoke(HttpContext context)
        {
            // Check if maintenance mode is enabled
            if (await IsMaintenanceModeEnabled() &&
                !context.Request.Path.ToString().Contains(_maintenanceHtmlPage))
            {
                context.Response.Redirect(_maintenanceHtmlPage);
                return;
            }

            await _next(context);
        }

        private async Task<bool> IsMaintenanceModeEnabled()
        {
            // Implement your own logic here to determine if maintenance mode is enabled
            bool isFeatureFlagMaintanceModeActive = await _featureManager.IsEnabledAsync("OnboardingMaintenanceMode");
            return isFeatureFlagMaintanceModeActive;
        }
    }
}
