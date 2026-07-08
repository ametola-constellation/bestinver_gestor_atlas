using AutoMapper;
using SimpleInjector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace BESTINVER.GestorAltas.Domain
{
    public static class AutoMapperConfig
    {
        private static List<Assembly> assemblies = new List<Assembly>();
        private static MapperConfiguration config;

        public static void Register(Container container, Assembly[] assemblies)
        {
            GetConfiguration(assemblies);
            container.RegisterInstance(config);
            container.Register(() => config.CreateMapper(container.GetInstance));
        }

        private static void AddAssemblyProfiles(IMapperConfigurationExpression cfg)
        {
            if (!assemblies.Contains(typeof(AutoMapperConfig).Assembly))
            {
                assemblies.Add(typeof(AutoMapperConfig).Assembly);
            }

            assemblies.ForEach(x => GetAssemblyProfiles(x).ForEach(cfg.AddProfile));
        }

        public static MapperConfiguration GetConfiguration(Assembly[] assemblies)
        {
            if (assemblies.Length > 0)
            {
                var newAssemblies = assemblies.Where(x => !AutoMapperConfig.assemblies.Contains(x)).ToList();
                AutoMapperConfig.assemblies.AddRange(newAssemblies);
            }

            config = new MapperConfiguration(AddAssemblyProfiles, Microsoft.Extensions.Logging.Abstractions.NullLoggerFactory.Instance);

            return config;
        }

        private static List<Profile> GetAssemblyProfiles(Assembly assembly)
        {
            return (from t in assembly.GetTypes()
                    where typeof(Profile).IsAssignableFrom(t)
                    select (Profile)Activator.CreateInstance(t)).ToList();
        }
    }
}