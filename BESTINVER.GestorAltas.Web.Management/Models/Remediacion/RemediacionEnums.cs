using System.ComponentModel;

namespace BESTINVER.GestorAltas.Web.Management.Models.Remediacion
{
    public enum TestTypeEnum
    {
        [Description("Persona Física")]
        PersonaFísica = 1,

        [Description("Representante")]
        Representante = 2,

        [Description("Tutor")]
        Tutor = 3,

        [Description("Persona Jurídica")]
        PersonaJurídica = 4
    }

    public enum RequestTypeEnum
    {
        [Description("Test y DNI")]
        Test_DNI = 1,

        [Description("Solo DNI")]
        DNI = 2,

        [Description("Solo Test")]
        Test = 3
    }

    public enum SendTypeEnum
    {
        [Description("Digital")]
        Mail = 1,

        [Description("Manual")]
        Postal = 2
    }

    public enum RequestStatusEnum
    {
        [Description("No iniciado")]
        NoIniciado = 1,

        [Description("Iniciado")]
        Iniciado = 2,

        [Description("Datos de contacto actualizados")]
        DatosContactoActualizados = 3,

        [Description("Test de conocimiento actualizado")]
        TestConocimientoActualizado = 4,

        [Description("Documento actualizado")]
        DocumentoActualizado = 5,

        [Description("Solicitud firmada")]
        SolicitudFirmada = 6,

        [Description("Solicitud finalizada parcialmente")]
        SolicitudFinalizadaParcialmente = 7,

        [Description("Solicitud aprovisionada en el core")]
        SolicitudAprovisionadaCore = 9,

        [Description("Solicitud finalizada")]
        SolicitudFinalizada = 10,

        [Description("Solicitud pendiente de verificar")]
        SolicitudPendienteVerificar = 11,

        [Description("Solicitud bloqueada")]
        SolicitudBloqueada = 12
    }

    public enum RemediationChannelType {
        [Description("Canal no informado")]
        NoAplica = 0,

        [Description("Telefónico")]
        Telefonico = 1
    }

}