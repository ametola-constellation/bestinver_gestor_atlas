using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;
using System.Text;
using static Microsoft.AspNetCore.Authorization.MiddleOfficeClaimNames;
using static Microsoft.AspNetCore.Authorization.MiddleOfficePermissionNames;

namespace Bestinver.Auth.Ldap.Migrations
{
    public partial class Add_Permisions_roles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoleClaims",
                columns: ["ClaimType", "ClaimValue", "RoleId"],
                values: new object[,]
                {
                    {MiddleOfficePermission,DesbloqueoAlertaDatosPersonales,"d44704fb-6cbc-41fc-bb33-f9f3bf4e70bb"},
                });
        }

        //protected override void Down(MigrationBuilder migrationBuilder)
        //{

        //}
    }
}
