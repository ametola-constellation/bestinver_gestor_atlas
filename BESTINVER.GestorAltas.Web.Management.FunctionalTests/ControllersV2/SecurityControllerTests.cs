using Bestinver.Auth.Ldap.Models;
using Bestinver.Auth.Ldap.Services;
using Bestinver.GestorAltas.Web.Management.Controllers;
using BESTINVER.GestorAltas.Web.Management.Models.Security;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.ControllersV2
{

    public class SecurityControllerTests : BaseTest
    {
        private SecurityController securityController { get; }

        public SecurityControllerTests() {

            var ldapService = new GraphService(this.LdapSettingsOptions, ConfigureLogger<GraphService>(),null);
            var roleManager = Mock.Of<RoleManager<IdentityRole>>();
            var userManager = Mock.Of<UserManager<ApplicationUser>>();
            var roleService = new RoleService(roleManager);
            var userService = new UserService(userManager, ldapService);

            this.securityController = new SecurityController(roleService, userService, ConfigureLogger<SecurityController>());
        }

        //[Fact]
        public async Task GetRolesListTest() {

            // Act
            var result = await this.securityController.GetRolesList();

            // Assert
            Assert.NotNull(result);
        }

        //[Fact]
        public async Task GetSecurityUsersTest()
        {
            // Arrange
            var model = new JQueryDataTableParamModel();

            // Act
            var result = await this.securityController.GetSecurityUsers(model);

            // Assert
            Assert.NotNull(result);
        }
        
        //[Fact]
        public async Task AddUserToRoleTest()
        {
            // Arrange
            string roleName = string.Empty;
            string userId = string.Empty;

            // Act
            var result = await this.securityController.AddUserToRole(roleName, userId);

            // Assert
            Assert.NotNull(result);
        }

        //[Fact]
        public async Task RemoveUserRolesTest()
        {
            // Arrange
            string userId = string.Empty;

            // Act
            var result = await this.securityController.RemoveUserRoles(userId);

            // Assert
            Assert.NotNull(result);
        }

        //[Fact]
        public async Task DeleteUserTest()
        {
            // Arrange
            string userId = string.Empty;

            // Act
            var result = await this.securityController.DeleteUser(userId);

            // Assert
            Assert.NotNull(result);
        }

        //[Fact]
        public async Task CreateRoleTest()
        {
            // Arrange
            string roleName = string.Empty;

            // Act
            var result = await this.securityController.CreateRole(roleName);

            // Assert
            Assert.NotNull(result);
        }

        //[Fact]
        public async Task DeleteRoleTest()
        {
            // Arrange
            string roleName = string.Empty;

            // Act
            var result = await this.securityController.DeleteRole(roleName);

            // Assert
            Assert.NotNull(result);
        }

        //[Fact]
        public async Task GetPermissionsTest()
        {
            // Arrange
            string roleName = string.Empty;

            // Act
            var result = await this.securityController.GetPermissions(roleName);

            // Assert
            Assert.NotNull(result);
        }


        //[Fact]
        public async Task SetPermissionTest()
        {
            // Arrange
            var model = new RolePermissionsModel();

            // Act
            var result = await this.securityController.SetPermission(model);

            // Assert
            Assert.NotNull(result);
        }

        //[Fact]
        public async Task InitLdapUsersTest()
        {
            // Act
            var result = await this.securityController.InitLdapUsers();

            // Assert
            Assert.NotNull(result);
        }
    }
}
