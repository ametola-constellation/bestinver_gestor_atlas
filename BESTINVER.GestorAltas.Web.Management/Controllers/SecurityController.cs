using Bestinver.Auth.Ldap.Identity.Models;
using Bestinver.Auth.Ldap.Services;
using BestInver.WebPrivada.Shared.Models.Shared.Enums;
using BESTINVER.GestorAltas.Web.Management.Models;
using BESTINVER.GestorAltas.Web.Management.Models.Security;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bestinver.Auth.Ldap.Models;
using Microsoft.Extensions.Logging;

namespace Bestinver.GestorAltas.Web.Management.Controllers
{
    [Authorize(Roles = DefaultRoles.Admin)]
    [Route("[controller]/[action]")]
    public class SecurityController : Controller
    {
        private readonly IRoleService roleService;
        private readonly IUserService userService;
        private readonly ILogger<SecurityController> logger;

        public SecurityController(IRoleService roleService, IUserService userService, ILogger<SecurityController> logger)
        {
            this.userService = userService;
            this.roleService = roleService;
            this.logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetRolesList()
        {
            var roles = await roleService.GetRoles();

            var rolesJSON = from r in roles
                            select new { text = r.Name, value = r.Id };

            var result = rolesJSON.ToList();
            result.Add(new { text = "Seleccione uno...", value = "" });

            return Ok(new
            {
                data = result.OrderBy(i => i.value)
            });
        }

        public async Task<IActionResult> GetSecurityUsers(JQueryDataTableParamModel p)
        {
            var users = await userService.GetUsers().ConfigureAwait(false);
            var filteredItems = users;

            var sortColumnIndex = Convert.ToInt32(p.ISortCol_0);
            Func<ApplicationUser, string> orderingFunction = (c =>
                sortColumnIndex == 0 ? c.UserName :
                c.Email);

            if (!string.IsNullOrWhiteSpace(p.SSearch))
            {
                var searchQuery = p.SSearch.ToLowerInvariant();
                filteredItems =
                    filteredItems.Where(d => (!string.IsNullOrEmpty(d.UserName) && d.UserName.Contains(searchQuery, StringComparison.InvariantCultureIgnoreCase))
                        ||
                    (!string.IsNullOrEmpty(d.Email) && d.Email.Contains(searchQuery, StringComparison.InvariantCultureIgnoreCase))
                        ||
                    d.Roles.Select(i => i.ToLowerInvariant()).Contains(searchQuery)).ToList();
            }

            if (string.Equals(p.SSortDir_0, nameof(SortDirection.Asc), StringComparison.OrdinalIgnoreCase))
            {
                filteredItems = filteredItems.OrderBy(orderingFunction).ToList();
            }
            else
            {
                filteredItems = filteredItems.OrderByDescending(orderingFunction).ToList();
            }

            var displayedItems = filteredItems
                .Skip(p.IDisplayStart)
                .Take(p.IDisplayLength);

            var results = from d in displayedItems
                          select new[] {
                              d.UserName,
                              d.Email,
                              string.Join(",", d.Roles),
                              d.Id
                          };

            return Json(new
            {
                p.SEcho,
                iTotalRecords = users.Count(),
                iTotalDisplayRecords = filteredItems.Count(),
                aaData = results
            });
        }

        [HttpPut("{roleName}")]
        public async Task<IActionResult> AddUserToRole([FromRoute]string roleName, [FromBody]string userId)
        {
            var identityResult = await userService.AddUserToRole(userId, roleName).ConfigureAwait(false);
            if (identityResult.Succeeded)
            {
                return Ok(new { result = "Rol asignado correctamente" });
            }
            return BadRequest(identityResult.Errors.Aggregate(new StringBuilder(), (a, b) => a.AppendLine(b.Description)).ToString());
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> RemoveUserRoles([FromRoute]string userId)
        {
            var identityResult = await userService.RemoveUserRoles(userId).ConfigureAwait(false);

            if (identityResult.Succeeded)
            {
                return Ok(new { result = "Roles de usuario desasignado correctamente" });
            }
            return BadRequest(identityResult.Errors.Aggregate(new StringBuilder(), (a, b) => a.AppendLine(b.Description)).ToString());
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser([FromRoute]string userId)
        {
            var identityResult = await userService.RemoveUser(userId).ConfigureAwait(false);

            if (identityResult.Succeeded)
            {
                return Ok(new { result = "Usuario eliminado correctamente" });
            }
            return BadRequest(identityResult.Errors.Aggregate(new StringBuilder(), (a, b) => a.AppendLine(b.Description)).ToString());
        }

        [HttpPost("{roleName}")]
        public async Task<IActionResult> CreateRole([FromRoute]string roleName)
        {
            var identityResult = await roleService.CreateRole(roleName).ConfigureAwait(false);

            if (identityResult.Succeeded)
            {
                return Ok(new { result = "Rol creado correctamente" });
            }
            return BadRequest(identityResult.Errors.Aggregate(new StringBuilder(), (a, b) => a.AppendLine(b.Description)).ToString());
        }

        [HttpDelete("{roleName}")]
        public async Task<IActionResult> DeleteRole([FromRoute]string roleName)
        {
            var identityResult = await roleService.RemoveRole(roleName).ConfigureAwait(false);

            if (identityResult.Succeeded)
            {
                return Ok(new { result = "Rol borrado correctamente" });
            }
            return BadRequest(identityResult.Errors.Aggregate(new StringBuilder(), (a, b) => a.AppendLine(b.Description)).ToString());
        }

        [HttpGet("{roleName}")]
        public async Task<IActionResult> GetPermissions([FromRoute]string roleName)
        {
            var claims = await roleService.GetClaims(roleName).ConfigureAwait(false);
            var authFields = typeof(MiddleOfficeClaimNames).GetFields();
            var authNames = authFields.Select(x => x.GetValue(null).ToString());
            return Ok(authNames.ToDictionary(x => x, x => claims.Any(a => a.Value == x) ? IdentityResult.Success : IdentityResult.Failed()));
        }

        [HttpPut]
        public async Task<IActionResult> SetPermission([FromBody]RolePermissionsModel model)
        {
            var identityResult = IdentityResult.Failed();

            if (ModelState.IsValid)
            {
                if (model.IsActive)
                {
                    var authFields = typeof(MiddleOfficeClaimNames).GetFields();
                    var authNames = authFields.Select(x => x.GetValue(null));
                    if (authNames.Contains(model.Name))
                    {
                        identityResult = await roleService.AddClaim(model.RoleName, model.Type, model.Name).ConfigureAwait(false);
                    }
                    else
                    {
                        ModelState.AddModelError(nameof(model.Name), "Permission not found.");
                    }
                }
                else
                {
                    identityResult = await roleService.RemokeClaim(model.RoleName, model.Type, model.Name).ConfigureAwait(false);
                }
                if (identityResult.Succeeded)
                {
                    return Ok(identityResult);
                }
                identityResult.Errors.ToList().ForEach(x => ModelState.AddModelError(x.Code, x.Description));
            }
            return BadRequest(identityResult);
        }

        [HttpGet]
        public async Task<IActionResult> InitLdapUsers()
        {
            try
            {
                var identityResult = await userService.InitLdapUsers().ConfigureAwait(false);
                if (identityResult.All(i => i.Succeeded))
                {
                    return Ok(identityResult);
                }
                else
                {
                    logger.LogError("Error SecurityController-InitLdapUsers (synchronize users): {IdentityResult}", identityResult);
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error SecurityController-InitLdapUsers (synchronize users): {Message}", ex.Message);
                return BadRequest(ex.Message);
            }
        }
    }
}