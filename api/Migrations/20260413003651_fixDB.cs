using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class fixDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkItem_Users_UserId",
                table: "WorkItem");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkItem_Workspace_WorkspaceId",
                table: "WorkItem");

            migrationBuilder.DropForeignKey(
                name: "FK_Workspace_Users_OwnerId",
                table: "Workspace");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Workspace",
                table: "Workspace");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WorkItem",
                table: "WorkItem");

            migrationBuilder.RenameTable(
                name: "Workspace",
                newName: "Workspaces");

            migrationBuilder.RenameTable(
                name: "WorkItem",
                newName: "WorkItems");

            migrationBuilder.RenameIndex(
                name: "IX_Workspace_OwnerId",
                table: "Workspaces",
                newName: "IX_Workspaces_OwnerId");

            migrationBuilder.RenameIndex(
                name: "IX_WorkItem_WorkspaceId",
                table: "WorkItems",
                newName: "IX_WorkItems_WorkspaceId");

            migrationBuilder.RenameIndex(
                name: "IX_WorkItem_UserId",
                table: "WorkItems",
                newName: "IX_WorkItems_UserId");

            migrationBuilder.AlterColumn<int>(
                name: "WorkspaceId",
                table: "WorkItems",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Workspaces",
                table: "Workspaces",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WorkItems",
                table: "WorkItems",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkItems_Users_UserId",
                table: "WorkItems",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkItems_Workspaces_WorkspaceId",
                table: "WorkItems",
                column: "WorkspaceId",
                principalTable: "Workspaces",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Workspaces_Users_OwnerId",
                table: "Workspaces",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkItems_Users_UserId",
                table: "WorkItems");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkItems_Workspaces_WorkspaceId",
                table: "WorkItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Workspaces_Users_OwnerId",
                table: "Workspaces");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Workspaces",
                table: "Workspaces");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WorkItems",
                table: "WorkItems");

            migrationBuilder.RenameTable(
                name: "Workspaces",
                newName: "Workspace");

            migrationBuilder.RenameTable(
                name: "WorkItems",
                newName: "WorkItem");

            migrationBuilder.RenameIndex(
                name: "IX_Workspaces_OwnerId",
                table: "Workspace",
                newName: "IX_Workspace_OwnerId");

            migrationBuilder.RenameIndex(
                name: "IX_WorkItems_WorkspaceId",
                table: "WorkItem",
                newName: "IX_WorkItem_WorkspaceId");

            migrationBuilder.RenameIndex(
                name: "IX_WorkItems_UserId",
                table: "WorkItem",
                newName: "IX_WorkItem_UserId");

            migrationBuilder.AlterColumn<int>(
                name: "WorkspaceId",
                table: "WorkItem",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Workspace",
                table: "Workspace",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WorkItem",
                table: "WorkItem",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkItem_Users_UserId",
                table: "WorkItem",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkItem_Workspace_WorkspaceId",
                table: "WorkItem",
                column: "WorkspaceId",
                principalTable: "Workspace",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Workspace_Users_OwnerId",
                table: "Workspace",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
