using BestInver.WebPrivada.Shared.Models.Microservices.Alerts;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BESTINVER.GestorAltas.MicroservicesProxy.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services.Validators
{
    public class RegisterValidateSolucionesConfirma : IRegisterValidator
    {
        private readonly ConfirmaResponse confirmaResponse;
        private readonly IEnumerable<AlertType> alerTypes;
        private readonly Guid request;
        private readonly string dni;

        public RegisterValidateSolucionesConfirma(ConfirmaResponse confirmaResponse, Guid request, IEnumerable<AlertType> alerTypes, string dni)
        {
            this.confirmaResponse = confirmaResponse;
            this.request = request;
            this.alerTypes = alerTypes;
            this.dni = dni;
        }

        public RegisterValidateResult Validate()
        {
            var alertsList = new List<Alert>();

            if (confirmaResponse.PersonaPublica)
            {
                var alertype = alerTypes.FirstOrDefault(a => a.Id == (int)AlertTypes.AlertaPersonaPublica);
                alertsList.Add(
                    new Alert
                    {
                        RequestId = request,
                        BeginDate = DateTime.UtcNow,
                        Details = "Alerta Persona Pública. El solicitante fue detectado por Soluciones Confirma en la lista FACTIVA.",
                        AlertType = alertype
                    });
            }
            else if (confirmaResponse.Terrorist)
            {
                var alertype = alerTypes.FirstOrDefault(a => a.Id == (int)AlertTypes.AlertaTerrorismo);

                alertsList.Add(
                   new Alert
                   {
                       RequestId = request,
                       BeginDate = DateTime.UtcNow,
                       Details = $"Alerta Terrorista. El solicitante fue detectado por Soluciones Confirma en la lista {confirmaResponse.List}",
                       AlertType = alertype
                   });
            }
            else if (confirmaResponse.ConnectionError)
            {
                var alertype = alerTypes.FirstOrDefault(a => a.Id == (int)AlertTypes.AlertaSolucionesConfirma);

                alertsList.Add(
                   new Alert
                   {
                       RequestId = request,
                       BeginDate = DateTime.UtcNow,
                       Details = $"Alerta Validación por Jurídico. No ha sido posible verificar al partícipe con DNI / NIE ({dni}) contra listas de denegación debido a un error de contectividad",
                       AlertType = alertype
                   });
            }

            return new RegisterValidateResult
            {
                blockRegister = alertsList.Count > 0,
                alerts = alertsList,
                customException = alertsList.Any(a => a.AlertType.Id == (int)AlertTypes.AlertaTerrorismo) ? new RequestForbiddenException() : null,
                registerValidationType = RegisterValidationType.None
            };
        }
    }
}
