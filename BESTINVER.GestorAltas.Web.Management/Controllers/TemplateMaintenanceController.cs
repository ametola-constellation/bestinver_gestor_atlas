using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.ViewModels;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using System.Net;

namespace BESTINVER.GestorAltas.Web.Management.Controllers
{
    [Authorize(MiddleOfficeClaimNames.GestionPlantillas)]
    public class TemplateMaintenanceController : TimezoneController
    {
        private readonly ITemplateMaintenanceService templateMaintenanceService;
        private readonly ILogger<TemplateMaintenanceController> logger;

        public TemplateMaintenanceController(
            ITemplateMaintenanceService templateMaintenanceService,
            ILogger<TemplateMaintenanceController> logger)
        {
            this.logger = logger;
            this.templateMaintenanceService = templateMaintenanceService;
        }

        [HttpGet]
        public async Task<IActionResult> Index([FromQuery] string templateName)
        {
            var Templates = await templateMaintenanceService.GetList().ConfigureAwait(false);

            if(!string.IsNullOrWhiteSpace(templateName) && !Templates.Any(t=>t.TemplateName.Equals(templateName, StringComparison.OrdinalIgnoreCase)))
            {
                System.Threading.Thread.Sleep(3000);
                Templates = await templateMaintenanceService.GetList().ConfigureAwait(false);
            }

            var model = new TemplateMaintenanceViewModel()
            {
                Templates = new List<SelectListItem>()
            };

            foreach (var template in Templates)
            {
                SelectListItem item = new SelectListItem()
                {
                    Text = template.TemplateName,
                    Value = template.TemplateName
                };
                if (!string.IsNullOrWhiteSpace(templateName) && templateName.Equals(item.Value, StringComparison.CurrentCultureIgnoreCase))
                {
                    item.Selected = true;
                }

                model.Templates.Add(item);
            }

            return View(model);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteTemplate([FromQuery] string templateName)
        {

            return Ok(await templateMaintenanceService.DeleteTemplate(templateName).ConfigureAwait(false));

        }

        [HttpGet]
        public async Task<IActionResult> DownloadTemplate([FromQuery] string templateName)
        {
            try
            {

                byte[] template = await templateMaintenanceService.DownloadTemplate(templateName).ConfigureAwait(false);
                var templatebase = Convert.ToBase64String(template);
                if (template == null)
                {
                    return StatusCode((int)HttpStatusCode.Moved);
                }

                return Ok(templatebase);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error: {ex.Message}");
                return StatusCode((int)HttpStatusCode.Moved);
            }
        }


        [HttpPost]
        public async Task<IActionResult> UploadTemplate([FromForm] TemplateMaintenanceViewModel files)
        {

            try
            {
                var file = files.File;
                var ms = new MemoryStream();
                file.CopyTo(ms);
                var file64 = Convert.ToBase64String(ms.ToArray());
                var result = await templateMaintenanceService.UpdateTemplate(file64, file.FileName).ConfigureAwait(false);
                if (result)
                {
                    AddCustomSuccess("Plantilla subida correctamente");
                    return RedirectToAction("Index", new { templateName = file.FileName });
                }
                else
                {
                    AddCustomError("No se ha podido subir la plantilla");
                }

            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error: {ex.Message}");
                AddCustomError("Excepción al subir la plantilla");
            }
            return RedirectToAction("Index");

        }

        [HttpGet]
        public async Task<IActionResult> GetTemplateFields(string templateName)
        {
            var result = await templateMaintenanceService.GetTemplateFields(templateName).ConfigureAwait(false);
            if (result != null)
            {
                result = result.OrderBy(t => t.Name);
            }
            return Ok(result);
        }


        [HttpPost]
        public async Task<IActionResult> FillTemplate([FromQuery] string templateName, [FromBody] List<PdfFields> data)
        {
            try
            {

                byte[] template = await templateMaintenanceService.FillTemplate(templateName, data).ConfigureAwait(false);
                var templatebase = Convert.ToBase64String(template);
                if (template == null)
                {
                    return StatusCode((int)HttpStatusCode.Moved);
                }

                return Ok(templatebase);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error: {ex.Message}");
                return StatusCode((int)HttpStatusCode.Moved);
            }
        }
    }
}
