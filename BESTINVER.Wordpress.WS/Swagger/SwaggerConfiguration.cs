using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.Wordpress.WS.Swagger
{
    /// <summary>
    /// Static class for swagger configuration
    /// </summary>
    public static class SwaggerConfiguration
    {

        /// <summary>
        /// AddRegistration for swagger service
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        public static IServiceCollection AddRegistration(this IServiceCollection services)
        {
            var basepath = System.AppDomain.CurrentDomain.BaseDirectory;
            var xmlpath = Path.Combine(basepath, "BESTINVER.Wordpress.WS.xml");

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "BESTINVER.Wordpress.WS v1", Version = "v1" });
                c.IncludeXmlComments(xmlpath);
            });


            return services;
        }


        /// <summary>
        /// AddRegistration for swagger app
        /// </summary>
        /// <param name="app"></param>
        /// <returns></returns>
        public static IApplicationBuilder AddRegistration(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "BESTINVER.Wordpress.WS v1"));
            return app; 
        }
        
    }
}
