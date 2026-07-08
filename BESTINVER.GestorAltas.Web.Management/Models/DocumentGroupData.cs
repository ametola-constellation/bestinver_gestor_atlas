using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BESTINVER.GestorAltas.Web.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class DocumentGroupData
    {
        [Required(ErrorMessage = "El Identificador del Request es obligatorio")]
        public Guid RequestId { get; set; }

        [Required(ErrorMessage = "El tipo de firma es obligatorio")]
        public DocumentSignatureType? IdDocumentSignatureType { get; set; }

        [Required(ErrorMessage = "La forma de envío de la documentación es obligatoria")]
        public SendingWayType? IdSendingWay { get; set; }

        public List<ApplicantMobile> MobilePhoneByApplicant { get; set; }

        public bool DisableUpdateSendingWays { get; set; }

        public bool AllowDigitalSignature { get; set; }

        public bool? sandbox { get; set; }
        public bool? asynchronous { get; set; } = false;
        public GenerateDocAction DocAction { get; set; }
        public bool AllowManualSignature { get; set; }
    }

    public enum GenerateDocAction
    {
        Generar = 1,
        Regenerar = 2
    }
}