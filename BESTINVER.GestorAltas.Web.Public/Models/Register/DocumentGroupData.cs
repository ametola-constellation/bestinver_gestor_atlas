using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Public.Models.Register
{
    public class DocumentGroupData
    {
        [Required]
        public Guid RequestId { get; set; }
        [Required]
        public int IdDocumentSignatureType { get; set; }
        [Required]
        public int IdSendingWay { get; set; }
        public List<ApplicantMobile> MobilePhoneByApplicant { get; set; }
        public bool DisableUpdateSendingWays { get; set; }
        public bool GenerateDoc { get; set; } = true;
        public bool ManagedByCommercial { get; set; }
    }

    public class ApplicantMobile
    {
        public string ApplicantId { get; set; }
        public string MobilePhone { get; set; }
        public bool IsMobilePhoneOk { get; set; }
        public int RequestApplicantType { get; set; }
        public string Mail { get; set; }
        public string RequestApplicantTypeName { get; set; }
    }
}
