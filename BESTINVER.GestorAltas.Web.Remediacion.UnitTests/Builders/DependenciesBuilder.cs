using BESTINVER.GestorAltas.Domain;
using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using SimpleInjector;
using SimpleInjector.Lifestyles;
using System;
using System.Net.Http;

namespace BESTINVER.GestorAltas.Web.Remediacion.Builders
{
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


        public DependenciesBuilder WithContainer()
        {
            container = new Container();
            container.Options.DefaultLifestyle = new AsyncScopedLifestyle();
            container.Options.DefaultScopedLifestyle = new AsyncScopedLifestyle();

            return this;
        }
        
        public Container Build()
        {
            AutoMapperConfig.Register(container, new[] {
                 typeof(BESTINVER.GestorAltas.MicroservicesProxy.Services.Configurations.Services).Assembly,
                 typeof(BESTINVER.GestorAltas.Web.Public.Controllers.RemediacionController).Assembly
            });
            container.Options.AllowOverridingRegistrations = true;
            container.Register<IAppSettings, AppSettings>(Lifestyle.Scoped);
            container.Register(typeof(ILogger<>), typeof(LoggerStub<>));

            return container;
        }

        public DependenciesBuilder WithContainer(Container container)
        {
            this.container = container;
            return this;
        }
    }
}
