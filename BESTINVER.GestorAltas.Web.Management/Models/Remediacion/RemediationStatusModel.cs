using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Management.Models.Remediacion
{
    public class RemediationStatusModel
    {
        public RemediationStatusModel()
        {
            ChangeLog = new List<ChangeLogModel>();
        }

        [Display(Name = "Le falta")]
        public RequestTypeEnum RequestType { get; set; }

        [Display(Name = "Tipo de test")]
        public TestTypeEnum? TestType { get; set; }

        [Display(Name = "Tipo de envío")]
        public SendTypeEnum? SendType { get; set; }

        [Display(Name = "Nombre")]
        public string Name { get; set; }

        [Display(Name = "Apellidos")]
        public string Surname { get; set; }

        [Display(Name = "URL de remediación")]
        public string RemediationUrl { get; set; }

        [Display(Name = "Fecha de caducidad DNI")]
        public DateTime? DNIExpiration { get; set; }

        public bool? DNINotExpire { get; set; }

        [Display(Name = "DNI")]
        public string DNI { get; set; }

        [Display(Name = "Email")]
        public string Email { get; set; }

        [Display(Name = "Teléfono")]
        public string Telefono { get; set; }

        [Display(Name = "Codigo cliente")]
        public string RDCliente { get; set; }

        [Display(Name = "Codigo RD")]
        public string RDTitular { get; set; }

        [Display(Name = "RequestID")]
        public Guid RequestId { get; set; }

        [Display(Name = "Canal")]
        public RemediationChannelType? Channel { get; set; } = RemediationChannelType.NoAplica;

        [Display(Name = "Estados")]
        public List<RemediacionRequestStatusModel> Status { get; set; }

        [Display(Name = "Fecha")]
        public DateTime Created { get; set; }

        [Display(Name = "Últimos 50 cambios")]
        public List<ChangeLogModel> ChangeLog { get; set; }

        [Display(Name = "Documentos en Docuware")]
        public string DocuwareIframeUrl { get; set; }

        [Display(Name = "Actualización test de conocimiento")]
        public bool ExpiredTest { get; set; }

        [Display(Name = "Error envio DNI a operaciones")]
        public bool ErrorSendDoc { get; set; }

        [Display(Name = "Error envio Test a operaciones")]
        public bool ErrorSendTest { get; set; }
    }
}