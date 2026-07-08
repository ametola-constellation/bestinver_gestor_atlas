using System;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Models.Remediacion
{
    public class ApplicantRoleRem
    {
        public int IdApplicant { get; set; }

        public Guid IdRequest { get; set; }

        public int RequestApplicantType { get; set; }

        public decimal? Percentage { get; set; }

        public DateTime? ReplaySignatureDate { get; set; }

        public DateTime? SignDate { get; set; }

        public bool? HasToSign { get; set; }

        public string OtpToken { get; set; }

        public string OtpId { get; set; }

        public string SignerMail { get; set; }

        public string SignerMobilePhone { get; set; }
    }
}
