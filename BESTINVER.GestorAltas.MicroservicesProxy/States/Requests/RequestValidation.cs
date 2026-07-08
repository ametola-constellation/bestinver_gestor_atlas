using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using System.Linq;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public class RequestValidationNoRestrictions : RequestValidation
    {
        public override bool HasActivePBCOrTerrorAlert()
        {
            return false;
        }

        public override bool HasAllDocumentsUploaded()
        {
            return true;
        }

        public override bool HasMadeTheMoneyTransfer()
        {
            return true;
        }

        public override bool HasOnlineSignature()
        {
            return true;
        }

        public override bool IsAbandoned()
        {
            return false;
        }

        public override bool IsCanceled()
        {
            return false;
        }

        public override bool IsExpired()
        {
            return false;
        }

        public override bool IsPhysical()
        {
            return true;
        }
    }

    public class RequestValidation : Request, IRequestValidation
    {
        /// <summary>
        /// Persona fisica
        /// </summary>
        /// <returns></returns>
        public virtual bool IsPhysical()
        {
            return Applicants.FirstOrDefault(ap => ap.ApplicantRoleType.Id == (int)ApplicantRoleType.Titular)?
                                        .Applicant?.ApplicantType.Id == (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.ApplicantType.Fisica;
        }

        public virtual bool IsCanceled()
        {
            return Status.Any(x => x.StatusType.Id == (int)RequestStatusEnum.Canceled);
        }

        public virtual bool IsAbandoned()
        {
            return Status.Any(x => x.StatusType.Id == (int)RequestStatusEnum.Abandoned);
        }

        public virtual bool IsExpired()
        {
            return Status.Any(x => x.StatusType.Id == (int)RequestStatusEnum.Expired);
        }

        public virtual bool HasActivePBCOrTerrorAlert()
        {
            return Alerts.Any(a =>
                       {
                           return ((a.AlertType.Id == (int)AlertTypes.AlertaPBC
                            || a.AlertType.Id == (int)AlertTypes.AlertaTerrorismo)
                            && !a.EndDate.HasValue) || a.Status.Value == AlertStatus.Denied;
                       }
                   );
        }

        public virtual bool HasAllDocumentsUploaded()
        {
            return Applicants.Where(a => a.ApplicantRoleType.Id != (int)ApplicantRoleType.Beneficiario).All(a => a.SentDni == true);
        }

        public virtual bool HasMadeTheMoneyTransfer()
        {
            return ProductOperations.Select(o => o.Operation).Any(o => o.IdOperationType == (int)OperationType.Traspaso);
        }

        public virtual bool HasOnlineSignature()
        {
            return IdDocumentGroup.HasValue && (IdSendingWay == (int)SendingWayType.FirmaOnline);
        }
    }
}