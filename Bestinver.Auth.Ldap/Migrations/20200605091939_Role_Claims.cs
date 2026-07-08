using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;
using System.Text;
using static Microsoft.AspNetCore.Authorization.MiddleOfficeClaimNames;
using static Microsoft.AspNetCore.Authorization.MiddleOfficePermissionNames;

namespace Bestinver.Auth.Ldap.Migrations
{
    public partial class Role_Claims : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoleClaims",
                columns: new[] { "ClaimType", "ClaimValue", "RoleId" },
                values: new object[,]
                {
                    {MiddleOfficePermission,SolicitudConsulta,"f69e0787-1c2e-450b-b36f-acf3e472c306"},
                    {MiddleOfficePermission,InformesConsulta,"f69e0787-1c2e-450b-b36f-acf3e472c306"},
                    {MiddleOfficePermission,BusquedaConsulta,"f69e0787-1c2e-450b-b36f-acf3e472c306"},
                    {MiddleOfficePermission,DocumentacionConsulta,"f69e0787-1c2e-450b-b36f-acf3e472c306"},
                    {MiddleOfficePermission,DocumentacionModificacion,"f69e0787-1c2e-450b-b36f-acf3e472c306"},
                    {MiddleOfficePermission,GestionAlertasModificacion,"f69e0787-1c2e-450b-b36f-acf3e472c306"},
                    {MiddleOfficePermission,FirmaAsincronaConsulta,"f69e0787-1c2e-450b-b36f-acf3e472c306"},
                    {MiddleOfficePermission,RevisionChequesConsulta,"f69e0787-1c2e-450b-b36f-acf3e472c306"},
                    {MiddleOfficePermission, MiddleOfficeClaimNames.Management,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,SolicitudConsulta,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,SolicitudModificacion,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,SolicitudBaja,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,InformesConsulta,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,InformesModificacion,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,InformesBaja,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,BusquedaConsulta,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,BusquedaModificacion,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,BusquedaBaja,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,DocumentacionConsulta,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,DocumentacionModificacion,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,DocumentacionBaja,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,GestionAlertasModificacion,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,FirmaAsincronaConsulta,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,FirmaAsincronaModificacion,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,FirmaAsincronaBaja,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,RevisionChequesConsulta,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,RevisionChequesModificacion,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,RevisionChequesBaja,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,ExportarInformesConsulta,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,ExportarInformesModificacion,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,ExportarInformesBaja,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,EstadosModificacion,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,ComentariosAlerta,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,EstadosModificacionSinBloqueo,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,RemediacionEstadosModificacion,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,ModificacionApoderados,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,GenerarFirmaDesdeMiddle,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,CotitularesValidar,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,RemediacionEstadosConsulta,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,RemediacionTipoModificacion,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,RemediacionVisualizarEstadoCotitulares,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,AvanzarEstadosAdministrador,"56f176af-a3f0-4251-8cbb-bfeed6607eb7"},
                    {MiddleOfficePermission,SolicitudConsulta,"f129331e-90ac-4fcf-a411-1c2831024007"},
                    {MiddleOfficePermission,InformesConsulta,"f129331e-90ac-4fcf-a411-1c2831024007"},
                    {MiddleOfficePermission,BusquedaConsulta,"f129331e-90ac-4fcf-a411-1c2831024007"},
                    {MiddleOfficePermission,DocumentacionConsulta,"f129331e-90ac-4fcf-a411-1c2831024007"},
                    {MiddleOfficePermission,FirmaAsincronaConsulta,"f129331e-90ac-4fcf-a411-1c2831024007"},
                    {MiddleOfficePermission,FirmaAsincronaModificacion,"f129331e-90ac-4fcf-a411-1c2831024007"},
                    {MiddleOfficePermission,FirmaAsincronaBaja,"f129331e-90ac-4fcf-a411-1c2831024007"},
                    {MiddleOfficePermission,RevisionChequesConsulta,"f129331e-90ac-4fcf-a411-1c2831024007"},
                    {MiddleOfficePermission,SolicitudModificacion,"d44704fb-6cbc-41fc-bb33-f9f3bf4e70bb"},
                    {MiddleOfficePermission,InformesModificacion,"d44704fb-6cbc-41fc-bb33-f9f3bf4e70bb"},
                    {MiddleOfficePermission,BusquedaModificacion,"d44704fb-6cbc-41fc-bb33-f9f3bf4e70bb"},
                    {MiddleOfficePermission,FirmaAsincronaModificacion,"d44704fb-6cbc-41fc-bb33-f9f3bf4e70bb"},
                    {MiddleOfficePermission,RevisionChequesModificacion,"d44704fb-6cbc-41fc-bb33-f9f3bf4e70bb"},
                    {MiddleOfficePermission,ExportarInformesConsulta,"d44704fb-6cbc-41fc-bb33-f9f3bf4e70bb"},
                    {MiddleOfficePermission,ExportarInformesModificacion,"d44704fb-6cbc-41fc-bb33-f9f3bf4e70bb"},
                    {MiddleOfficePermission,EstadosModificacion,"d44704fb-6cbc-41fc-bb33-f9f3bf4e70bb"},
                    {MiddleOfficePermission,EstadosModificacionSinBloqueo,"d44704fb-6cbc-41fc-bb33-f9f3bf4e70bb"},
                    {MiddleOfficePermission,ModificacionApoderados,"d44704fb-6cbc-41fc-bb33-f9f3bf4e70bb"},
                    {MiddleOfficePermission,GenerarFirmaDesdeMiddle,"d44704fb-6cbc-41fc-bb33-f9f3bf4e70bb"},
                    {MiddleOfficePermission,ComentariosAlerta,"d44704fb-6cbc-41fc-bb33-f9f3bf4e70bb"},
                    {MiddleOfficePermission,CotitularesValidar,"d44704fb-6cbc-41fc-bb33-f9f3bf4e70bb"},
                    {MiddleOfficePermission,SolicitudConsulta,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,SolicitudModificacion,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,SolicitudBaja,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,InformesConsulta,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,InformesModificacion,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,InformesBaja,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,BusquedaConsulta,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,BusquedaModificacion,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,BusquedaBaja,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,DocumentacionConsulta,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,DocumentacionModificacion,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,DocumentacionBaja,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,GestionAlertasModificacion,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,FirmaAsincronaConsulta,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,FirmaAsincronaModificacion,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,FirmaAsincronaBaja,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,RevisionChequesConsulta,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,RevisionChequesModificacion,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,RevisionChequesBaja,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,ExportarInformesConsulta,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,ExportarInformesModificacion,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,ExportarInformesBaja,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,EstadosModificacion,"d0aa38af-bc36-4744-860c-b33ac48b31b5"},
                    {MiddleOfficePermission,ModificacionApoderados,"d0aa38af-bc36-4744-860c-b33ac48b31b5"}
                });
        }

        //protected override void Down(MigrationBuilder migrationBuilder)
        //{

        //}
    }
}
