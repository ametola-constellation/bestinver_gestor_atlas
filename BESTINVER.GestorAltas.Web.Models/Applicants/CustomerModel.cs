using System;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class CustomerModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Surname1 { get; set; }
        public string Surname2 { get; set; }
        public string Surname { get; set; }
        public string DocumentNumber { get; set; }
        public DateTime BirthDate { get; set; }
        public string ClientOpenId { get; set; }
        public string Phone { get; set; }
        public bool IsMainPhone { get; set; }
        public string MobilePhone { get; set; }
        public bool IsMainMobilePhone { get; set; }
        public string WorkPhone { get; set; }
        public string IsMainWorkPhone { get; set; }
        public string Fax { get; set; }
        public string Mail { get; set; }
        public string CorrespondenceName { get; set; }
        public string Company { get; set; }
        public string CorrespondenceMail { get; set; }
        public string ReceptionType { get; set; }
        public AddressData Address { get; set; }
    }
}