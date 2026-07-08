using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Models.Remediacion
{
    public class JuridicApplicantRem
    {
        public int RdCode { get; set; }

        public string DocumentNumber { get; set; }

        public string Name { get; set; }

        public string FirstSurname { get; set; }

        public string SecondSurname { get; set; }

        public DateTime? Birthday { get; set; }

        public string Email { get; set; }

        public string MobilePhoneNumber { get; set; }

        public string BornPlace { get; set; }

        public int ApplicantTypeId { get; set; }

        public int RequestApplicantTypeId { get; set; }

        public decimal? Percentage { get; set; }

        public bool? HasToSign { get; set; }
    }
}
