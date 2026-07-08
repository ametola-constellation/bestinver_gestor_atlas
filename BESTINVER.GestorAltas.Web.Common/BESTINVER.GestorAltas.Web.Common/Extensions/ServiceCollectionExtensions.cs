using bestinver.crossapp.common.rules;
using Bestinver.Auth.Ldap.Data;
using Bestinver.Auth.Ldap.Identity.Models;
using Bestinver.Auth.Ldap.Identity.Policy;
using Bestinver.Auth.Ldap.Models;
using BESTINVER.GestorAltas.Web.Common.config;
using BESTINVER.GestorAltas.Web.Common.Models;
using BESTINVER.GestorAltas.Web.Common.Rules;
using BESTINVER.GestorAltas.Web.Common.Rules.Login;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Reflection;
using Microsoft.Identity.Web;
using Microsoft.Graph;
using Azure.Identity;
using Bestinver.Auth.Ldap.Services;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;


namespace BESTINVER.GestorAltas.Web.Common.Extensions
{
    public static class ServiceCollectionExtensions
    {
        const int COOKIE_AUTH_EXPIRETIME_DEFAULT = 35;
        internal static IServiceCollection AddRules(this IServiceCollection services)
        {
            services.AddTransient<IRuleProcessor<LoginRequest>, RuleProcesor<LoginRequest>>();

            //AddRules
            services.AddTransient<IRule<LoginRequest>, NameNotEmpty>();
            services.AddTransient<IRule<LoginRequest>, PasswordNotEmpty>();

            return services;
        }

        public static IServiceCollection AddCommonServices(this IServiceCollection services, IConfiguration configuration)
        {

            //Get a reference to the assembly that contains the view components
            var assembly = typeof(_base.ControllerBase).GetTypeInfo().Assembly;

            //Create an EmbeddedFileProvider for that assembly
            var embeddedFileProvider = new Microsoft.Extensions.FileProviders.EmbeddedFileProvider(
                assembly
            );

            //Add the file provider to the Razor view engine
            //services.Configure<MvcRazorRuntimeCompilationOptions>(options =>
            /**    {
            //        options.FileProviders.Clear();
            //        options.FileProviders.Add(embeddedFileProvider);
            //    });*/

            var assemblyname = typeof(ApplicationDbContext).GetTypeInfo().Assembly.GetName().Name;

            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(
                    configuration.GetConnectionString("BestinverSts"),
                    sqlServer =>
                        {
                            sqlServer.MigrationsAssembly(assemblyname);
                            sqlServer.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                        });
            });

            services.AddAuthorization(options =>
            {
                options.AddMiddleOfficePolicies();
                options.AddPolicy(DefaultRoles.Admin, policy => policy.RequireRole(DefaultRoles.Admin));
                options.AddPolicy("PrivateAccess", policy => policy.AddRequirements(new AllowPrivatePolicy()));
            });

            services.AddAADServices(configuration);
            services.ConfigureGraphComponent(configuration);

            var section = configuration.GetSection(nameof(GraphSettings));
            if (section == null)
            {
                throw new MissingMemberException("El sistema debe tener una configuración para Graph");
            }
            else
            {
                services.Configure<GraphSettings>(section);
                services.AddSingleton(section.Get<GraphSettings>());
            }
            services.AddScoped<IGraphService, GraphService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRoleService, RoleService>();
            return services;
        }

        private static void AddAADServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddRules();

            services.Configure<IdentityOptions>(options =>
            {
                // Password settings
                options.Password.RequireDigit = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 10;
                options.Lockout.AllowedForNewUsers = true;

                // User settings
                options.User.RequireUniqueEmail = true;
            });

            services.AddScoped<IUserStore<ApplicationUser>, UserStore>();
            services.AddScoped<IRoleStore<IdentityRole>, RoleStore>();
            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.AddScoped<IAuthorizationHandler, AllowPrivateHandler>();

            //Customizations 
            var loginConfiguration = GetLoginConfiguration(configuration);
            services.AddSingleton(loginConfiguration);

            // Settings to logout
            var azureAdSection = configuration.GetSection("AzureAd");
            services.Configure<AzureAdSettings>(azureAdSection);

            services.AddSingleton<ITicketStore, RedisCacheTicketStore>();
            services.AddSingleton<IPostConfigureOptions<CookieAuthenticationOptions>,ConfigureCookieAuthenticationOptions>();

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,options =>
            {
                options.ExpireTimeSpan = TimeSpan.FromMinutes(configuration["AppSettings:CookieAuthExpireTime"].ToCookieAuthExpireTime());
                options.SlidingExpiration = true;
                options.LoginPath = "/Account/login"; // If the LoginPath is not set here, ASP.NET Core will default to /Account/Login
                options.Cookie.Name = "app_backoffice";
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;

            }).AddMicrosoftIdentityWebApp(
                azureAdSection,
                openIdConnectScheme: OpenIdConnectDefaults.AuthenticationScheme,
                cookieScheme: null,
                displayName: "Login with Azure");                    
        }

        private static LoginConfiguration GetLoginConfiguration(IConfiguration configuration)
        {
            var loginConfiguration = configuration.GetSection(nameof(LoginConfiguration)).Get<LoginConfiguration>();

            // Cannot load configuration - use default configuration values
            if (loginConfiguration == null)
            {
                return new LoginConfiguration();
            }

            return loginConfiguration;
        }

        public static void UpdateDatabase(this IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices
                .GetRequiredService<IServiceScopeFactory>()
                .CreateScope())
            {
                using (var context = serviceScope.ServiceProvider.GetService<ApplicationDbContext>())
                {
                    try
                    {
                        context.Database.Migrate();
                    }
                    catch
                    {
                        return;
                    }
                }
            }
        }

        private static double ToCookieAuthExpireTime(this string cookieAuthExpireTime)
        {
            double result = Convert.ToDouble(string.IsNullOrEmpty(cookieAuthExpireTime) ? COOKIE_AUTH_EXPIRETIME_DEFAULT : cookieAuthExpireTime);
            return result;
        }

        private static IServiceCollection ConfigureGraphComponent(this IServiceCollection services, IConfiguration configuration)
        {
            var graphSettings = configuration.GetSection(typeof(GraphSettings).Name)
                                                     .Get<GraphSettings>();
            var tenantId = graphSettings.TenantId;
            var clientId = graphSettings.ClientId;
            var clientSecret = graphSettings.ClientSecret;

            var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
            //you can use a single client instance for the lifetime of the application
            services.AddSingleton(sp => { return new GraphServiceClient(credential); });

            return services;
        }
    }
    public class ConfigureCookieAuthenticationOptions
  : IPostConfigureOptions<CookieAuthenticationOptions>
    {
        private readonly ITicketStore _ticketStore;

        public ConfigureCookieAuthenticationOptions(ITicketStore ticketStore)
        {
            _ticketStore = ticketStore;
        }

        public void PostConfigure(string name,
                 CookieAuthenticationOptions options)
        {
            options.SessionStore = _ticketStore;
        }
    }

}
