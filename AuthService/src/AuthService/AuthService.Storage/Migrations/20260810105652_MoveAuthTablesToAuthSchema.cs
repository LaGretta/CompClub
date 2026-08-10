using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuthService.Storage.Migrations
{
    /// <inheritdoc />
    public partial class MoveAuthTablesToAuthSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "auth");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "Users",
                newSchema: "auth");

            migrationBuilder.RenameTable(
                name: "UserRoles",
                newName: "UserRoles",
                newSchema: "auth");

            migrationBuilder.RenameTable(
                name: "Sessions",
                newName: "Sessions",
                newSchema: "auth");

            migrationBuilder.RenameTable(
                name: "Roles",
                newName: "Roles",
                newSchema: "auth");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "Users",
                schema: "auth",
                newName: "Users");

            migrationBuilder.RenameTable(
                name: "UserRoles",
                schema: "auth",
                newName: "UserRoles");

            migrationBuilder.RenameTable(
                name: "Sessions",
                schema: "auth",
                newName: "Sessions");

            migrationBuilder.RenameTable(
                name: "Roles",
                schema: "auth",
                newName: "Roles");
        }
    }
}
