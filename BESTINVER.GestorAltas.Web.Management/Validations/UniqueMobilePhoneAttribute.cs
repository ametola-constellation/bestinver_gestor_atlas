using BESTINVER.GestorAltas.Web.Management.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;
using BESTINVER.GestorAltas.Web.Models;

namespace System.ComponentModel.DataAnnotations
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
    public class UniqueMobilePhoneAttribute : ValidationAttribute, IClientModelValidator
    {
        public int ApplicantType { get; private set; }

        public UniqueMobilePhoneAttribute(int ApplicantType)
        {
            this.ApplicantType = ApplicantType;
        }

        public void AddValidation(ClientModelValidationContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            context.Attributes["data-val"] = "true";
            context.Attributes["data-val-applicanttype"] = ApplicantType.ToString();
            context.Attributes["data-val-uniquemobilephone"] = GetErrorMessage();
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            string mobile = string.Empty;
            string InvalidPhones = string.Empty;

            if (validationContext.ObjectInstance.GetType() == typeof(TitularContactDataModel))
            {
                TitularContactDataModel obj = (TitularContactDataModel)validationContext.ObjectInstance;
                mobile = string.IsNullOrEmpty(obj.MobilePhoneNumber) ? "" : obj.MobilePhoneNumber;
                InvalidPhones = obj.InvalidPhones;
            }
            else if (validationContext.ObjectInstance.GetType() == typeof(CotitularDataModel))
            {
                CotitularDataModel obj = (CotitularDataModel)validationContext.ObjectInstance;
                mobile = string.IsNullOrEmpty(obj.MobilePhoneNumber) ? "" : obj.MobilePhoneNumber;
                InvalidPhones = obj.InvalidPhones;
            }

            if (string.IsNullOrEmpty(InvalidPhones))
            {
                return ValidationResult.Success;
            }

            if (mobile.StartsWith("34"))
            {
                mobile = mobile.Replace("34", "");
            }

            if (mobile.StartsWith("+34"))
            {
                mobile = mobile.Replace("+34", "");
            }
            
            string[] arr = InvalidPhones.Split(';');
            
            if (Array.IndexOf(arr, mobile) >= 0) 
            {
                return new ValidationResult(GetErrorMessage());
            }

            return ValidationResult.Success;
        }

        private static string GetErrorMessage()
        {
            return $"Teléfono móvil incorrecto";
        }
    }
}