using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class OperationApplicantSignatureModel: RequestApplicant
    {
        public Guid RequestId { get; set; }
        public bool SendSignatureReplay { get; set; }
        public bool AllowSendSignatureReplay { get; set; }
    }
}
