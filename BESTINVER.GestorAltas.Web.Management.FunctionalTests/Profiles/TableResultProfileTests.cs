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
    public class TableResultProfileTests
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
        public void GivenRequestDashboardWhenMapReturnsTableResultModel()
        {
            var fixture = new Fixture();

            var sut = fixture.Build<RequestDashboard>()
                .Create();

            var result = mapper.Map<TableResultModel>(sut);

            Assert.IsNotNull(result);
            Assert.AreEqual(sut.ApplicantDNI, result.NIF);
            Assert.AreEqual(sut.ApplicantName, result.Name);
            Assert.AreEqual(sut.IdRequest, result.FriendlyID);
            Assert.AreEqual(sut.Id.ToString(), result.RequestID);
            Assert.AreEqual(sut.GetStatus(), result.Status);
            Assert.AreEqual(sut.GetPBCAlerts().ToString(), result.PBCAlerts);
            Assert.AreEqual(sut.GetOtherAlerts().ToString(), result.OtherAlerts);
            Assert.AreEqual(sut.GetSignAlerts().ToString(), result.SignAlerts);
            Assert.AreEqual(sut.GetTerroristAlerts().ToString(), result.TerroristAlert);
            Assert.AreEqual(sut.AssistedBy, result.AssistedBy);
            Assert.AreEqual(sut.RequestStartDate, result.RequestStartDate);
        }

        [TestMethod]
        public void GivenPaginatedResultRequestDashboardWhenMapReturnsTableResultModel()
        {
            var fixture = new Fixture();

            var sut = fixture.Build<PaginatedResult<RequestDashboard>>()
                .Create();

            var result = mapper.Map<IEnumerable<TableResultModel>>(sut);

            Assert.IsNotNull(result);
        }

        [TestMethod]
        public void GivenRequestDashboardWithAlertsReturnsTerroristAndPBCAlert()
        {
            var fixture = new Fixture();
            var source = fixture.Build<RequestDashboard>().Create();
            source.Alerts.First().AlertType.Id = (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.AlertTypes.AlertaPersonaPublica;
            source.Alerts.ElementAt(1).AlertType.Id = (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.AlertTypes.AlertaPBC;
            source.Alerts.Last().AlertType.Id = (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.AlertTypes.AlertaTerrorismo;
            source.Alerts.Last().EndDate = null;
            var sut = mapper.Map<TableResultModel>(source);
            var result = sut.ToTable();
            Assert.AreEqual(nameof(AlertModel.PBC), sut.PBCAlerts);
            Assert.AreEqual(nameof(AlertModel.T), sut.TerroristAlert);
            Assert.IsFalse(string.IsNullOrEmpty(result[6]));
        }
    }
}