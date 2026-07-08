using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Domain.Extensions
{
    public static class ApplicantRoleExtensions
    {
        public static bool EsTitular(this ApplicantRole type)
        {
            int[] titularTypes = {
                (int)ApplicantRoleType.Titular,
                (int)ApplicantRoleType.Cotitular,
                (int)ApplicantRoleType.TitularAndTutor,
                (int)ApplicantRoleType.CotitularAndTutor,
                (int)ApplicantRoleType.Heredero,
                (int)ApplicantRoleType.HerederoAndTutor,
                (int)ApplicantRoleType.CoHeredero,
                (int)ApplicantRoleType.CoHerederoAndTutor,                
                (int)ApplicantRoleType.BeneficiarioDonacion,
                (int)ApplicantRoleType.Minusvalido
            };
            return titularTypes.Contains(type.Id);
        }
    }
}
