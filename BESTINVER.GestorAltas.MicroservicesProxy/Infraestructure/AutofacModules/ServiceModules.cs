using Autofac;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using Microsoft.Extensions.Configuration;
using System.Reflection;

namespace BESTINVER.GestorAltas.Web.Management
{
    public class ServiceModules : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            //Se inyecta el servicio de registro de servicios
            var assembly = Assembly.GetExecutingAssembly();

            // Register all types in the Services
            builder.RegisterAssemblyTypes(assembly)
                    .Where(t => t.Namespace != null && t.Namespace.EndsWith("Services"))
                    .AsImplementedInterfaces()
                    .InstancePerLifetimeScope();
        }
    }
}
