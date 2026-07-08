using AutoFixture;
using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.Domain;
using BESTINVER.GestorAltas.Web.Management.Models.Dashboard;
using BESTINVER.GestorAltas.Web.Management.Profiles;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.Profiles
{
    [TestClass]
    public class PostalTableResultProfileTests
    {
        protected IMapper mapper;

        [TestInitialize]
        public void Init()
        {
            mapper = AutoMapperConfig.GetConfiguration(new[] {
                typeof(TableResultProfile).Assembly
            }).CreateMapper();
        }

        [TestMethod]
        public void GivenPaginatedResultRequestDashboardWhenMapReturnsTableResultModelItems()
        {
            var fixture = new Fixture();

            var sut = fixture.Build<PaginatedResult<RequestDashboard>>()
                .Create();

            var result = mapper.Map<IEnumerable<TableResultModel>>(sut);

            Assert.IsNotNull(result);
        }
    }
}