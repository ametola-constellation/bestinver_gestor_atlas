using AutoFixture;
using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.Domain;
using BESTINVER.GestorAltas.Web.Management.Profiles;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.Profiles
{
    [TestClass]
    public class ApplicantSearchListProfileTests
    {
        private IMapper mapper;

        [TestInitialize]
        public void Init()
        {
            mapper = AutoMapperConfig.GetConfiguration(new[] {
                typeof(ApplicantSearchListProfile).Assembly
            }).CreateMapper();
        }

        [TestMethod]
        public void GivenApplicantSearchListModelWhenMapReturnsPaginatedSearchRequestDashboardSearch()
        {
            var fixture = new Fixture();

            var sut = fixture.Build<ApplicantSearchListModel>().Create();
            var result = mapper.Map<PaginatedSearch<RequestDashboardSearch>>(sut);
            Assert.IsNotNull(result);
            Assert.AreEqual(sut.OrderBy, result.Sort.SortField);
            Assert.AreEqual((int?)sut.OrderDir, (int?)result.Sort.SortDirection);
            Assert.AreEqual(sut.DNI, result.Search.DNI);
            Assert.AreEqual(sut.DocStatus, result.Search.DocStatus);
            Assert.AreEqual(sut.EndDate, result.Search.EndDate);
            Assert.AreEqual(sut.FirstSurname, result.Search.FirstSureName);
            Assert.AreEqual(sut.FromPrice, result.Search.FromPrice);
            Assert.AreEqual((int?)sut.FundStatus, result.Search.FundStatus);
            Assert.AreEqual(sut.IdSendingWay, result.Search.IdSendingWay);
            Assert.AreEqual(sut.IDSolicitud, result.Search.IDSolicitud);
            Assert.AreEqual(sut.IncidenceAlerts, result.Search.IncidenceAlerts);
            Assert.AreEqual(sut.Limit, result.Limit);
            Assert.AreEqual(sut.LockedBy, result.Search.LockedBy);
            Assert.AreEqual(sut.ManagedByCommercial, result.Search.ManagedByCommercial);
            Assert.AreEqual(sut.Name, result.Search.Name);
            Assert.AreEqual(sut.NotInStatus.Cast<int>().First(), result.Search.NotInStatus.First());
            Assert.AreEqual(sut.Offset, result.Offset);
            Assert.AreEqual(sut.PBCAlerts, result.Search.PBCAlerts);
            Assert.AreEqual(sut.Pending, result.Search.Pending);
            Assert.AreEqual(sut.Product, result.Search.Product);
            Assert.AreEqual(sut.ProductType, result.Search.ProductType);
            Assert.AreEqual(sut.RequestApplicantType, result.Search.RequestApplicantType);
            //Assert.AreEqual((int?)sut.RequestChannel, result.Search.RequestChannel);
            Assert.AreEqual((int?)sut.SalesChannel, result.Search.SalesChannel);
            Assert.AreEqual(sut.SecondSurname, result.Search.SecondSureName);
            Assert.AreEqual(sut.SendDocumentAlerts, result.Search.SendDocumentAlerts);
            Assert.AreEqual(sut.SignAlerts, result.Search.SignAlerts);
            Assert.AreEqual(sut.SignStatus, result.Search.SignStatus);
            Assert.AreEqual((int?)sut.SignType, result.Search.SignType);
            Assert.AreEqual(sut.StartDate, result.Search.StartDate);
            Assert.AreEqual(sut.Status, result.Search.Status);
            Assert.AreEqual(sut.TerroristAlerts, result.Search.TerroristAlerts);
            Assert.AreEqual(sut.ToPrice, result.Search.ToPrice);
            Assert.AreEqual(sut.Username, result.Search.Username);
            Assert.AreEqual(sut.ValidateUploadDocs, result.Search.ValidateUploadDocs);
        }
    }
}