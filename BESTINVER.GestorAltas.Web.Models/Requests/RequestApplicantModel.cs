using System;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class RequestApplicantModel
    {
        public bool? SentDni { get; set; }
        public bool? LifeCicleOk { get; set; }
        public DateTime? ReplaySignatureDate { get; set; }
        public int? ElectronicSignatureServiceVersion { get; set; }
        public ApplicantData Applicant { get; set; }
        public ApplicantRoleModel ApplicantRoleType { get; set; }
        public IEnumerable<TestModel> Tests { get; set; }
        public IEnumerable<CountryModel> Countries { get; set; }
        public IEnumerable<DocumentModel> Documents { get; set; }
    }

    public class CountryModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CountryType { get; set; }
    }

    public class DocumentModel
    {
        public string Id { get; set; }
        public string Number { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}