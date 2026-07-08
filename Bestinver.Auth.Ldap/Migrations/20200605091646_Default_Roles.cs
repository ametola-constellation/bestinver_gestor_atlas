using Bestinver.Auth.Ldap.Identity.Models;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bestinver.Auth.Ldap.Migrations
{
    public partial class Default_Roles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            Down(migrationBuilder);
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "Name", "NormalizedName", "ConcurrencyStamp" },
                values: new object[,]
                {
                    { "56f176af-a3f0-4251-8cbb-bfeed6607eb7", DefaultRoles.Admin, DefaultRoles.Admin.ToUpper(), "9ce365b7-9de4-4f60-a965-2b895e40156b" },
                    { "f129331e-90ac-4fcf-a411-1c2831024007", DefaultRoles.Consulta, DefaultRoles.Consulta.ToUpper(), "df977b42-2fa0-471b-ad61-76797d244ffe" },
                    { "d44704fb-6cbc-41fc-bb33-f9f3bf4e70bb", DefaultRoles.Gestor, DefaultRoles.Gestor.ToUpper(), "e55344a0-8a05-4605-9983-128429e2cb98" },
                    { "f69e0787-1c2e-450b-b36f-acf3e472c306", DefaultRoles.Juridico, DefaultRoles.Juridico.ToUpper(), "20313096-39c4-4833-a812-0c236c89e9d6" },
                    { "d0aa38af-bc36-4744-860c-b33ac48b31b5", DefaultRoles.Maestro, DefaultRoles.Maestro.ToUpper(), "7b67a867-f3eb-4e33-b70f-71fdd4208138" },
                    { "fa18152a-38d9-4b0f-82b2-5b6d94a26756", DefaultRoles.Remediacion, DefaultRoles.Remediacion.ToUpper(), "1fb4d53a-48a8-4689-94dc-eee6c57a89d2" },
                    { "831c145b-e3b7-4f77-bd4f-955a2d0a0396", DefaultRoles.Operaciones, DefaultRoles.Operaciones.ToUpper(), "24a8bf9a-ee85-4e32-ba93-2e23dd969bd" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
               table: "AspNetRoles",
               keyColumns: new[] { "Id", "ConcurrencyStamp" },
               keyValues: new object[] { "56f176af-a3f0-4251-8cbb-bfeed6607eb7", "9ce365b7-9de4-4f60-a965-2b895e40156b" });

            migrationBuilder.DeleteData(
               table: "AspNetRoles",
               keyColumns: new[] { "Id", "ConcurrencyStamp" },
               keyValues: new object[] { "f129331e-90ac-4fcf-a411-1c2831024007", "df977b42-2fa0-471b-ad61-76797d244ffe" });

            migrationBuilder.DeleteData(
               table: "AspNetRoles",
               keyColumns: new[] { "Id", "ConcurrencyStamp" },
               keyValues: new object[] { "d44704fb-6cbc-41fc-bb33-f9f3bf4e70bb", "e55344a0-8a05-4605-9983-128429e2cb98" });

            migrationBuilder.DeleteData(
               table: "AspNetRoles",
               keyColumns: new[] { "Id", "ConcurrencyStamp" },
               keyValues: new object[] { "f69e0787-1c2e-450b-b36f-acf3e472c306", "20313096-39c4-4833-a812-0c236c89e9d6" });

            migrationBuilder.DeleteData(
               table: "AspNetRoles",
               keyColumns: new[] { "Id", "ConcurrencyStamp" },
               keyValues: new object[] { "d0aa38af-bc36-4744-860c-b33ac48b31b5", "7b67a867-f3eb-4e33-b70f-71fdd4208138" });

            migrationBuilder.DeleteData(
               table: "AspNetRoles",
               keyColumns: new[] { "Id", "ConcurrencyStamp" },
               keyValues: new object[] { "fa18152a-38d9-4b0f-82b2-5b6d94a26756", "1fb4d53a-48a8-4689-94dc-eee6c57a89d2" });

            migrationBuilder.DeleteData(
               table: "AspNetRoles",
               keyColumns: new[] { "Id", "ConcurrencyStamp" },
               keyValues: new object[] { "831c145b-e3b7-4f77-bd4f-955a2d0a0396", "24a8bf9a-ee85-4e32-ba93-2e23dd969bd" });
        }
    }
}
