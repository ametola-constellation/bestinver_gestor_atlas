using BESTINVER.GestorAltas.Web.Management.ViewModels;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class TitularDataModel : LockedItemModel
    {
        public Guid RequestId { get; set; }

        [DisplayName(ResourceKeys.RdClientCode)]
        [Required]
        public int? RdClientCode { get; set; }

        [DisplayName(ResourceKeys.Dni)]
        [Required]
        public string DNI { get; set; }

        [DisplayName(ResourceKeys.Name)]
        [Required]
        [MaxLength(20)]
        public string Name { get; set; }

        [DisplayName(ResourceKeys.FirstSurname)]
        [MaxLength(30)]
        public virtual string FirstSurname { get; set; }

        [DisplayName(ResourceKeys.SecondSurname)]
        [MaxLength(30)]
        public string SecondSurname { get; set; }

        [DisplayName(ResourceKeys.ApplicantType)]
        [Required]
        public int ApplicantType { get; set; }

        [DisplayName(ResourceKeys.RequestApplicantType)]
        [Required]
        public int RequestApplicantType { get; set; }

        [DisplayName(ResourceKeys.Birthday)]
        public DateTime? Birthday { get; set; }

        [DisplayName(ResourceKeys.Gender)]
        [Required]
        public int? Gender { get; set; }

        [DisplayName(ResourceKeys.Nacionality)]
        [Required]
        public int? Nacionality { get; set; }

        [DisplayName(ResourceKeys.Country)]
        [Required]
        public int? Country { get; set; }

        [DisplayName(ResourceKeys.SpanishResident)]
        [Required]
        public bool IsResident { get; set; }

        [DisplayName(ResourceKeys.DocumentExpirationDate)]
        public DateTime? IDDocumentExpirationDate { get; set; }

        [DisplayName(ResourceKeys.DocumentIsPermanent)]
        public bool IDDocumentIsPermanent { get; set; }

        public bool IsMinor { get; set; }
        public bool IsJuridic { get; set; }

        public List<SelectItemModel> Genders { get; set; }
        public List<SelectItemModel> Countries { get; set; }
        public List<SelectItemModel> Nationalities { get; set; }

        public string DisabledSaveButton { get; set; } = ActionEnabler.Disable;
        public string Disabled { get; set; } = ActionEnabler.Disable;
        public bool gdpr { get; set; }
        public bool gdprEvents { get; set; }
        public DateTime gdprDate { get; set; }
        public DateTime gdprEventsDate { get; set; }

        public TitularDataModel()
        {            
        }
        public int? IdRequestChannel { get; set; }
        public bool ShowOperationChange { get; set; }
    }
}