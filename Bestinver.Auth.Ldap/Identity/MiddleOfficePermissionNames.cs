using System;
using System.Collections.Generic;
using System.Text;

namespace Microsoft.AspNetCore.Authorization
{
    public static class MiddleOfficePermissionNames
    {
        public const string MiddleOfficePermission = "middle-office-permission";
    }

    public struct MiddleOfficeClaimNames
    {
        public const string AvanzarEstadosAdministrador = "Avanzar_Estados_Administrador";
        public const string BusquedaBaja = "Busqueda_Baja";
        public const string BusquedaConsulta = "Busqueda_Consulta";
        public const string BusquedaModificacion = "Busqueda_Modificacion";
        public const string ClientesDatosConsulta = "Clientes_Datos_Consulta";
        public const string ClientesDatosModificacion = "Clientes_Datos_Modificacion";
        public const string ComentariosAlerta = "Comentarios_Alerta";
        public const string CotitularesValidar = "Cotitulares_Validar";
        public const string DocumentacionBaja = "Documentacion_Baja";
        public const string DocumentacionConsulta = "Documentacion_Consulta";
        public const string DocumentacionModificacion = "Documentacion_Modificacion";
        public const string EstadosModificacion = "Estados_Modificacion";
        public const string EstadosModificacionSinBloqueo = "Estados_Modificacion_Sin_Bloqueo";
        public const string ExportarInformesBaja = "Exportar_Informes_Baja";
        public const string ExportarInformesConsulta = "Exportar_Informes_Consulta";
        public const string ExportarInformesModificacion = "Exportar_Informes_Modificacion";
        public const string FirmaAsincronaBaja = "FirmaAsincrona_Baja";
        public const string FirmaAsincronaConsulta = "FirmaAsincrona_Consulta";
        public const string FirmaAsincronaModificacion = "FirmaAsincrona_Modificacion";
        public const string GenerarFirmaDesdeMiddle = "Generar_Firma_Desde_Middle";
        public const string GestionAlertasModificacion = "GestionAlertas_Modificacion";
        public const string InformesBaja = "Informes_Baja";
        public const string InformesConsulta = "Informes_Consulta";
        public const string InformesModificacion = "Informes_Modificacion";
        public const string Management = "Management";
        public const string ModificacionApoderados = "Modificacion_Apoderados";
        public const string RemediacionEstadosConsulta = "Remediacion_Estados_Consulta";
        public const string RemediacionEstadosModificacion = "Remediacion_Estados_Modificacion";
        public const string RemediacionTipoModificacion = "Remediacion_Tipo_Modificacion";
        public const string RemediacionVisualizarEstadoCotitulares = "Remediacion_Visualizar_Estado_Cotitulares";
        public const string RevisionChequesBaja = "RevisionCheques_Baja";
        public const string RevisionChequesConsulta = "RevisionCheques_Consulta";
        public const string RevisionChequesModificacion = "RevisionCheques_Modificacion";
        public const string SolicitudBaja = "Solicitud_Baja";
        public const string SolicitudConsulta = "Solicitud_Consulta";
        public const string SolicitudModificacion = "Solicitud_Modificacion";
        public const string DashboardEnvioPostalConsulta = "Dashboard_EnvioPostal_Consulta";
        public const string DashboardFirmaManuscritaConsulta = "Dashboard_FirmaManuscrita_Consulta";
        public const string DashboardIncidenciaConsulta = "Dashboard_Incidencia_Consulta";
        public const string DashboardPBCConsulta = "Dashboard_PBC_Consulta";
        public const string DashboardPendientesAtendidasConsulta = "Dashboard_PendientesAtendidas_Consulta";
        public const string DashboardPendientesDNIConDNISubidoConsulta = "Dashboard_PendientesDNIConDNISubido_Consulta";
        public const string DesbloqueoAlertaProducto = "Desbloqueo_Alerta_Producto";
        public const string DesbloqueoAlertaDatosPersonales = "Desbloqueo_Alerta_Datos_Personales";
        public const string DesbloqueoAlertaMantenimiento = "Desbloqueo_Alerta_Mantenimiento";
        public const string GestionPlantillas = "GestionPlantillas";
        public const string MantenimientoPlantillasComunicaciones = "MantenimientoPlantillasComunicaciones";
        public const string InboxApoderados = "InboxApoderados";
    }
}
