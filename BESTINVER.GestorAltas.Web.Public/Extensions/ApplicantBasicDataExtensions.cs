using BESTINVER.GestorAltas.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Public.Extensions
{
    public static class ApplicantBasicDataExtensions
    {
        public static BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request.ApplicantBasicData GetBasicData(this BESTINVER.GestorAltas.Web.Models.ApplicantBasicData basicData)
        {
            return new BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request.ApplicantBasicData
            {
                ApplicantType = basicData.ApplicantType,
                Dni = basicData.DNI,
                Email = basicData.Email,
                Fax = basicData.Fax,
                FirstSurname = basicData.FirstSurname,
                IDDocumentType = basicData.IDDocumentType,
                InformationRight = basicData.InformationRight,
                Legal = basicData.Legal,
                LifeCicleOk = basicData.LifeCicleOk,
                MobilePhoneNumber = basicData.MobilePhoneNumber,
                Name = basicData.Name,
                PhoneNumber = basicData.PhoneNumber,
                RequestApplicantType = basicData.RequestApplicantType,
                SecondSurname = basicData.SecondSurname
            };
        }
    }
}