using BESTINVER.GestorAltas.MicroservicesProxy.Services.Configurations;
using Microsoft.Extensions.Options;
using SimpleInjector;
using SimpleInjector.Lifestyles;
using BESTINVER.GestorAltas.Domain;
using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using Microsoft.AspNetCore.Http;

namespace BESTINVER.Wordpress.WS.Tests.Builders
{
    public class Options<T> : IOptions<T>
        where T : class, new()
    {
        public T Value { get; set; }
    }

    public class LoggerStub<T> : ILogger<T>
    {
        public IDisposable BeginScope<TState>(TState state)
        {
            return null;
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return false;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
        {
        }
    }

    public class DependenciesBuilder
    {
        private Container container;
        private Dependencies dependecies;

        public DependenciesBuilder WithContainer()
        {
            container = new Container();
            container.Options.DefaultLifestyle = new AsyncScopedLifestyle();
            container.Options.DefaultScopedLifestyle = new AsyncScopedLifestyle();

            return this;
        }

        public DependenciesBuilder WithDependencies()
        {
            dependecies = new Dependencies(container);

            return this;
        }

        public Container Build()
        {
            var apiBuilder = new ApiWebPrivadaHelperBuilder().WithDefaultDevSettings();

            container.Register(typeof(ILogger<>), typeof(LoggerStub<>));
            container.RegisterInstance(apiBuilder.identityServerConfig);
            container.RegisterInstance(apiBuilder.configurationManager);
            AutoMapperConfig.Register(container, new[] {
                 typeof(BESTINVER.GestorAltas.MicroservicesProxy.Services.Configurations.Services).Assembly,
                 typeof(BESTINVER.Wordpress.WS.Controllers.ProfitabilityController).Assembly,
                 typeof(BESTINVER.Wordpress.WS.Controllers.CarterasController).Assembly
            });

            container.RegisterInstance<Microsoft.Extensions.Configuration.IConfiguration>(apiBuilder.configuration);

            dependecies.Register();
            container.Options.AllowOverridingRegistrations = true;
            container.RegisterInstance<BESTINVER.GestorAltas.MicroservicesProxy.IApiWebPrivadaHelper>(apiBuilder.Build());
            container.Register<IAppSettings, AppSettings>(Lifestyle.Scoped);

            return container;
        }

        public DependenciesBuilder WithContainer(Container container)
        {
            this.container = container;
            return this;
        }
    }
}
