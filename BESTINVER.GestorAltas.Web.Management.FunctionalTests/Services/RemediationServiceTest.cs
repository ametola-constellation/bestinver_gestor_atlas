using BESTINVER.GestorAltas.Web.Management.Controllers;
using BESTINVER.GestorAltas.Web.Management.FunctionalTests.Builders;
using BESTINVER.GestorAltas.Web.Management.Models.Remediacion;
using Microsoft.AspNetCore.Mvc;
using SimpleInjector.Lifestyles;
using System;
using System.Threading.Tasks;
using Xunit;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.Services
{
    public class RemediationServiceTest : IClassFixture<DependenciesBuilder>
    {
        private readonly DependenciesBuilder dependenciesBuilder;

        public RemediationServiceTest(DependenciesBuilder dependenciesBuilder)
        {
            this.dependenciesBuilder = dependenciesBuilder.WithContainer().WithDependencies();
        }

        [Fact]
        public async Task SetRemediacionStatusTest()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var controller = container.GetInstance<RemediacionController>();
                Guid reqId = new Guid("571A3521-EEC0-44B7-881C-02C64B37883D");
                RequestStatusEnum status = RequestStatusEnum.SolicitudBloqueada;
                string descrip = "myDescription";

                var result = await controller.SetRemediacionStatus(reqId, status, descrip);

                Assert.IsType<ViewResult>(result);
            }
        }

        [Fact]
        public async Task UpdateSendTypeTest()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var controller = container.GetInstance<RemediacionController>();
                Guid reqId = new Guid("571A3521-EEC0-44B7-881C-02C64B37883D");
                SendTypeEnum sndType = SendTypeEnum.Mail;

                var result = await controller.UpdateSendType(reqId, sndType);

                Assert.IsType<ViewResult>(result);
            }
        }

        [Fact]
        public async Task UpdateRequestTypeTest()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var controller = container.GetInstance<RemediacionController>();
                Guid reqId = new Guid("571A3521-EEC0-44B7-881C-02C64B37883D");
                RequestTypeEnum reqType = RequestTypeEnum.Test_DNI;

                var result = await controller.UpdateRequestType(reqId, reqType);

                Assert.IsType<ViewResult>(result);
            }
        }

        [Fact]
        public async Task UpdateDniExpirationTest()
        {
            var container = dependenciesBuilder.Build();
            using (var scope = AsyncScopedLifestyle.BeginScope(container))
            {
                var controller = container.GetInstance<RemediacionController>();
                Guid reqId = new Guid("571A3521-EEC0-44B7-881C-02C64B37883D");
                DateTime dtExp = DateTime.Now;
                bool bNotExp = true;

                var result1 = await controller.UpdateDniExpiration(reqId);
                Assert.IsType<ViewResult>(result1);

                var result2 = await controller.UpdateDniExpiration(reqId, dtExp);
                Assert.IsType<ViewResult>(result2);

                var result3 = await controller.UpdateDniExpiration(reqId, dtExp, null);
                Assert.IsType<ViewResult>(result3);

                var result4 = await controller.UpdateDniExpiration(reqId, null, bNotExp);
                Assert.IsType<ViewResult>(result4);
            }
        }
    }
}