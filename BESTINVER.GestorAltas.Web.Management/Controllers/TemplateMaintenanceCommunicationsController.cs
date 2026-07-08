using AutoMapper;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.IO;
using System.Net;
using BestInver.WebPrivada.Shared.Models.Shared;
using BestInver.WebPrivada.Shared.Models.Microservices.TemplateCommunications;
using BestInver.WebPrivada.Shared.Models.Middleware.MiddleOffice;

namespace BESTINVER.GestorAltas.Web.Management.Controllers
{
    [Authorize(MiddleOfficeClaimNames.MantenimientoPlantillasComunicaciones)]
    public class TemplateMaintenanceCommunicationsController : TimezoneController
    {
        private readonly ITemplateMaintenanceCommunicationsService templateMaintenanceCommunicationsService;
        private readonly ICommunicationsService communicationsService;
        private readonly ILogger<TemplateMaintenanceController> logger;
        private readonly IMapper mapper;

        public TemplateMaintenanceCommunicationsController(
            ITemplateMaintenanceCommunicationsService templateMaintenanceCommunicationsService,
			ICommunicationsService communicationsService,
            IMapper mapper,
            ILogger<TemplateMaintenanceController> logger)
        {
            this.logger = logger;
            this.mapper = mapper;
            this.templateMaintenanceCommunicationsService = templateMaintenanceCommunicationsService;
            this.communicationsService = communicationsService;
        }

        [HttpGet]
        public async Task<IActionResult> Index([FromQuery] string templateName, int productId)
        {
            var Products = await communicationsService.GetCommunicationsProducts().ConfigureAwait(false);

            var model = new TemplateMaintenanceCommunicationsViewModel()
            {
                Templates = new List<SelectListItem>(),
                Products = new List<SelectListItem>()
            };

            foreach (var product in Products)
            {
                SelectListItem item = new SelectListItem()
                {
                    Text = product.Name,
                    Value = product.Id.ToString()
                };
                if (productId > 0 && productId == product.Id)
                {
                    item.Selected = true;
                }

                model.Products.Add(item);
            }

            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetTemplates([FromQuery] string productId, [FromQuery] string productName)
        {
            var product = new SelectListItem { Value = productId, Text = productName };

            var result = await templateMaintenanceCommunicationsService.GetList(product).ConfigureAwait(false);
            var templates = new List<SelectListItem>();
            foreach (var item in result)
            {
                templates.Add(new SelectListItem { Text = item.FileName, Value = item.TemplateId.ToString() });
            }
            return Ok(templates);
        }

        [HttpGet]
        public async Task<IActionResult> GetTemplateFields([FromQuery] string templateName, [FromQuery] string productName)
        {
            var result = await templateMaintenanceCommunicationsService.GetTemplateFields(templateName, productName).ConfigureAwait(false);
            if (result != null)
            {
                result = result.OrderBy(t => t.Name);
            }
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> UploadTemplate([FromForm] TemplateMaintenanceCommunicationsViewModel files)
        {
            try
            {   
                if (files.ProductSelected == 0)
                {
                    AddCustomError("Se debe seleccionar un producto para subir una plantilla.");
                }
                else {
                    var file = files.File;
                    var ms = new MemoryStream();
                    file.CopyTo(ms);
                    var file64 = Convert.ToBase64String(ms.ToArray());
                    var templateCommunication = new TemplateCommunicationsUploadRequest { IdProduct = files.ProductSelected, ProductName = files.ProductNameSelected, BodyBase64 = file64, FileName = file.FileName };
                    var result = await templateMaintenanceCommunicationsService.UploadTemplate(templateCommunication).ConfigureAwait(false);
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
                
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error: {ex.Message}");
                AddCustomError("Excepción al subir la plantilla");
            }
            return RedirectToAction("Index");
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteTemplate([FromQuery] string templateName, [FromQuery]string productName, [FromQuery] string productId)
        {
            return Ok(await templateMaintenanceCommunicationsService.DeleteTemplate(templateName, productName, productId).ConfigureAwait(false));
        }

        [HttpGet]
        public async Task<IActionResult> DownloadTemplate([FromQuery] string templateName, [FromQuery] string productName)
        {
            try
            {
                byte[] template = await templateMaintenanceCommunicationsService.DownloadTemplate(templateName, productName).ConfigureAwait(false);
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
        public async Task<IActionResult> FillTemplate([FromQuery] string templateName, [FromQuery] string productName, [FromBody] List<PdfFields> data)
        {
            try
            {

                byte[] template = await templateMaintenanceCommunicationsService.FillTemplate(templateName, productName, data).ConfigureAwait(false);
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
