using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Models.Requests
{
    public enum RequestAlertTypes
    {
        AlertaTerrorismo = 1,
        AlertaDatosPersonales = 2,
        AlertaTokenSuperado = 3,
        AlertaPBC = 4,
        AlertaPersonaPublica = 5,
        AlertaDocumentacionPersonaFisica = 6,
        AlertaDocumentacionPersonaJuridica = 7,
        AlertaDNI = 8,
        AlertaDinero = 9,
        AlertaRD = 10,
        AlertaSolucionesConfirma = 11,
        AlertaEnvioDocumentacion = 12,
        AlertaIncidencia = 13,
        AlertaPendienteValidarJuridico = 14,
        AlertaPendienteGenerarDocumentacion = 15,
        AlertaDatosPersonalesCuentaMancomunada = 16,
        AlertaErrorAria = 17,
        AlertaProducto = 18,
        AlertaElectronicID = 19,
        AlertaFirmaBloqueada = 20,
        AlertaMovilDuplicado = 21
    }
}
