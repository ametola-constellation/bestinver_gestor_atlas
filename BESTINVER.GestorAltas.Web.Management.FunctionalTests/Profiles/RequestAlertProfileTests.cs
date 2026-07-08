using AutoFixture;
using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Alerts;
using BESTINVER.GestorAltas.Domain;
using BESTINVER.GestorAltas.Web.Management.Profiles;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.Profiles
{
    [TestClass]
    public class RequestAlertProfileTests
    {
        protected IMapper mapper;

        [TestInitialize]
        public void Init()
        {
            mapper = AutoMapperConfig.GetConfiguration(new[] {
                typeof(RequestAlertProfile).Assembly
            }).CreateMapper();
        }

        [TestMethod]
        public void GivenRequestAlertModelMapToAlert()
        {
            var fixture = new Fixture();
            var sut = fixture.Build<RequestAlertModel>().Create();
            var result = mapper.Map<Alert>(sut);
            Assert.IsNotNull(result);
        }

        [TestMethod]
        public void GivenAlertMapToRequestAlertModel()
        {
            var fixture = new Fixture();
            var sut = fixture.Build<Alert>().Create();
            var result = mapper.Map<RequestAlertModel>(sut);
            Assert.IsNotNull(result);
        }
    }
}