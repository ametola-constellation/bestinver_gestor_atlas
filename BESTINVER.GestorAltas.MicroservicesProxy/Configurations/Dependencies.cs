using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
using BESTINVER.GestorAltas.Web.Management.Common;
using Microsoft.AspNetCore.Http;
using SimpleInjector;
using SimpleInjector.Advanced;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Reflection;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services.Configurations
{
    public class Services
    {
        public Type Service { get; set; }
        public Type Implementation { get; set; }
    }

    // Custom constructor resolution behavior
    public class GreediestConstructorBehavior : IConstructorResolutionBehavior
    {
        public ConstructorInfo GetConstructor(Type implementationType) => (
            from ctor in implementationType.GetConstructors().ToList()
            orderby ctor.GetParameters().Length descending
            select ctor)
            .First();
    }

    public class MostResolvableConstructorBehavior
    : IConstructorResolutionBehavior
    {
        private readonly Container container;

        public MostResolvableConstructorBehavior(Container container)
        {
            this.container = container;
        }

        private bool IsCalledDuringRegistrationPhase => !container.IsLocked();

        [DebuggerStepThrough]
        public ConstructorInfo GetConstructor(Type implementationType)
        {
            var constructor = GetConstructors(implementationType).FirstOrDefault();
            if (constructor != null)
            {
                return constructor;
            }

            throw new ActivationException(BuildExceptionMessage(implementationType));
        }

        private IEnumerable<ConstructorInfo> GetConstructors(Type implementation) =>
            from ctor in implementation.GetConstructors()
            let parameters = ctor.GetParameters()
            where IsCalledDuringRegistrationPhase
                || implementation.GetConstructors().Length == 1
                || ctor.GetParameters().All(CanBeResolved)
            orderby parameters.Length descending
            select ctor;

        private bool CanBeResolved(ParameterInfo parameter) =>
            GetInstanceProducerFor(new InjectionConsumerInfo(parameter)) != null;

        private InstanceProducer GetInstanceProducerFor(InjectionConsumerInfo i) =>
            container.Options.DependencyInjectionBehavior.GetInstanceProducer(i, false);

        private static string BuildExceptionMessage(Type type) =>
            type.GetConstructors().Length == 0
                ? TypeShouldHaveAtLeastOnePublicConstructor(type)
                : TypeShouldHaveConstructorWithResolvableTypes(type);

        private static string TypeShouldHaveAtLeastOnePublicConstructor(Type type) =>
            string.Format(CultureInfo.InvariantCulture,
                "For the container to be able to create {0}, it should contain at least " +
                "one public constructor.", type.ToFriendlyName());

        private static string TypeShouldHaveConstructorWithResolvableTypes(Type type) =>
            string.Format(CultureInfo.InvariantCulture,
                "For the container to be able to create {0}, it should contain a public " +
                "constructor that only contains parameters that can be resolved.",
                type.ToFriendlyName());
    }

    public sealed class Dependencies
    {
        private readonly Container container;

        public Dependencies(Container container)
        {
            this.container = container;
            this.container.Options.ConstructorResolutionBehavior =
        new MostResolvableConstructorBehavior(container);
        }

        public static List<Services> GetServiceRegistrations()
        {
            return (from type in typeof(Dependencies).Assembly.GetExportedTypes()
                    where type.Namespace.EndsWith("MicroservicesProxy.Services", StringComparison.Ordinal)
                    where type.GetInterfaces().Length > 0 && !type.IsInterface && !type.IsGenericType
                    select new Services { Service = type.GetInterfaces().First(x => x.Name.TrimStart('I').Equals(type.Name, StringComparison.Ordinal)), Implementation = type }).ToList();
        }

        public Container Register()
        {
            container.Register<IApiWebPrivadaHelper, ApiWebPrivadaHelper>();
            container.Register<IRequestValidation, RequestValidation>();            
            container.Register<IRequestStateFactory, RequestStateFactory>();
            container.Register<IHttpContextAccessor, HttpContextAccessor>();
            container.Register(typeof(IRequestStoreStateContext<>), typeof(RequestStoreStateContext<>));
            //Service registation
            GetServiceRegistrations().ForEach(reg => container.Register(reg.Service, reg.Implementation));

            return container;
        }
    }
}