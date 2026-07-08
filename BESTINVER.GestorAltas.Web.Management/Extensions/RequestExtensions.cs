using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using System.Collections.Generic;
using System.Linq;

namespace BestInver.WebPrivada.Shared.Models.Microservices.Requests
{
    public static class RequestExtensions
    {
        public static bool GetIndGestorComercial(this Request request)
            => request.ManagedByCommercial == true;

        public static RequestApplicant GetRequestOwner(this Request request)
        {
            return request.Applicants.FirstOrDefault(x => x.ApplicantRoleType.Id == (int)ApplicantRoleType.Titular
            || x.ApplicantRoleType.Id == (int)ApplicantRoleType.Heredero
            || x.ApplicantRoleType.Id == (int)ApplicantRoleType.Minusvalido
            || x.ApplicantRoleType.Id == (int)ApplicantRoleType.TitularAndTutor
            || x.ApplicantRoleType.Id == (int)ApplicantRoleType.BeneficiarioDonacion);
        }

        public static IEnumerable<RequestApplicant> GetRequestCotitulares(this Request request)
        {
            return request.Applicants.Where(x => x.ApplicantRoleType.Id != (int)ApplicantRoleType.Titular);
        }

        public static RequestLock GetRequestLock(this Request request)
        {
            if (request.Locks.Any())
            {
                return request.Locks.OrderByDescending(x => x.StartDate).FirstOrDefault();
            }
            return new RequestLock();
        }

        public static bool GetIsReadonly(this Request request)
        {
            return request.Channel.Id == (int)RequestChannelType.Privada;
        }

        public static bool GetShowOperationChange(this Request request)
        {
            return request.Channel.Id == (int)RequestChannelType.Publica;
        }



        public static RequestStatus GetStatus(this Request m)
        {
            return m.Status.OrderByDescending(s => s.StartDate).Select(s => s).FirstOrDefault();
        }
    }
}