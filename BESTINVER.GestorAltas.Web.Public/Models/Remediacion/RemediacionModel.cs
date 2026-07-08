using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.Web.Models.Remediacion;
using BESTINVER.GestorAltas.Web.Public.Models.Register;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Public.Models.Remediacion
{
    public class RemediacionModel : RemediacionErrorModel
    {
        [Display(Name = "Flag que indica si el usuario tiene el dni pendiente de actualizar")]
        public bool UpdateDocument { get; set; }

        [Display(Name = "Flag que indica si el usuario tiene el test de conocimiento pendiente de actualizar")]
        public bool UpdateTest { get; set; }

        [Display(Name = "Código de remediación")]
        [Required(ErrorMessage = "El RemediacionId es obligatorio")]
        public string RemediacionId { get; set; }

        [Display(Name = "Identificador del usuario")]
        [MaxLength(10, ErrorMessage = "La longitud máxima permitida del ClientId es de 10 caracteres")]
        [Required(ErrorMessage = "El ClientId es obligatorio")]
        public string ClientId { get; set; }

        public string ClientCode { get; set; }
        public int RemediacionChannel { get; set; }
        public bool PendingSignature { get; set; }
        public bool IsExpiredKnowledgeTest { get; set; }
        public int RequestType { get; set; }


        public RemediacionPersonalDataModel PersonalData { get; set; }
        public IEnumerable<RemediacionTestModel> Test { get; set; }
        public RemediacionDniModel Dni { get; set; }
        public RemediacionSignatureDataModel Signature { get; set; }
        public MasterDataModel MasterData { get; set; }
        public IEnumerable<QuestionModel> Questions { get; set; }
        public IEnumerable<JuridicApplicantRem> JuridicApplicants { get; set; }
        public bool IsJointSignature { get; set; }
        public bool IsCompletedProcess { get; set; }
    }
}