using BESTINVER.GestorAltas.Web.Management.Profiles;
using AutoFixture;
using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.Domain;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.Profiles
{
    [TestClass]
    public class RequestStatusProfileTests
    {
        protected IMapper mapper;

        [TestInitialize]
        public void Init()
        {
            mapper = AutoMapperConfig.GetConfiguration(new[] {
                typeof(RequestStatusProfile).Assembly
            }).CreateMapper();
        }

        [TestMethod]
        public void GivenRequestStatusWhenMapReturnsRequestStatusModel()
        {
            var fixture = new Fixture();
            var sut = fixture.Build<RequestStatus>().Create();
            var result = mapper.Map<RequestStatusModel>(sut);

            Assert.IsNotNull(result);
            Assert.AreEqual(sut.Comments, result.Comments);
            Assert.AreEqual(sut.Id, result.Id);
            Assert.AreEqual(sut.IdRequest, result.IDRequest);
            Assert.AreEqual(sut.IdStatus, result.IDStatus);
            Assert.AreEqual(sut.Responsible, result.Responsible);
            Assert.AreEqual(sut.StartDate, result.StartDate);
            Assert.AreEqual(sut.StatusType.Name, result.StatusName);
            Assert.AreEqual(sut.StatusType.Description, result.StatusDescription);
        }

        [TestMethod]
        public void GivenRequestStatusWhenMapReturnsRequestStatusModelItems()
        {
            var fixture = new Fixture();
            var sut = fixture.Build<RequestStatus>().CreateMany();
            var result = mapper.Map<IEnumerable<RequestStatusModel>>(sut);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        public void GivenRequestStatusWhenMapperInstanceReturnsRequestStatusModelItems()
        {
            var fixture = new Fixture();
            var sut = fixture.Build<RequestStatus>().CreateMany();
            var result = mapper.Map<IEnumerable<RequestStatusModel>>(sut);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
        }
    }
}