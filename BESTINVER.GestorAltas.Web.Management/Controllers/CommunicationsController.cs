using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.ViewModels;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using BestInver.WebPrivada.Shared.Models.Microservices.Communications;
using BestInver.WebPrivada.Shared.Models.Microservices.TemplateCommunications;
using System.Linq;
using BESTINVER.GestorAltas.Web.Models;
using BESTINVER.GestorAltas.Web.Management.Models.Communications;
using Microsoft.Extensions.Options;
using BestInver.WebPrivada.Shared.Models.Shared;
using BestInver.WebPrivada.Shared.Models.Shared.Enums;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Net;

namespace BESTINVER.GestorAltas.Web.Management.Controllers
{
	[Authorize(MiddleOfficeClaimNames.MantenimientoPlantillasComunicaciones)]
	public class CommunicationsController : TimezoneController
    {
		private readonly IProductService productService;
        private readonly ITemplateMaintenanceCommunicationsService templateMaintenanceCommunicationsService;
		private readonly IEventsTemplatesService eventsTemplatesService;
		private readonly ICommunicationsService communicationsService;
		private readonly IOptions<Domain.Configurations.AppSettings> appSettings;

		public CommunicationsController(IProductService productService, ITemplateMaintenanceCommunicationsService templateMaintenanceCommunicationsService, IEventsTemplatesService eventsTemplatesService, ICommunicationsService communicationsService, IOptions<Domain.Configurations.AppSettings> appSettings)
		{
			this.productService = productService;
			this.templateMaintenanceCommunicationsService = templateMaintenanceCommunicationsService;
			this.eventsTemplatesService = eventsTemplatesService;
			this.communicationsService = communicationsService;
			this.appSettings = appSettings;
		}

		[HttpGet]
        public async Task<IActionResult> Index()
        {

            var productList = await communicationsService.GetCommunicationsProducts().ConfigureAwait(false);
			var products = ConvertToSelectListItem(productList, "Id", "Name").ToList();

            var model = new CommunicationsViewModel()
            {
                ProductList = productList.ToList(),
                Products = products,
				EventList = new List<EventTemplate>(),
                Events = new List<SelectListItem>(),
                Marketer = new List<SelectListItem>(),
				MarketerList = new List<SelectListItem>(),
				NameSurname = string.Empty,
                NifNiePasaporte = string.Empty,
                Segment = string.Empty,
                TemplateList = new List<TemplateCommunication>(),
                Templates = new List<SelectListItem>(),
				MaxClientsToGenerate = this.appSettings.Value.MaxClientsToGenerate,
				UrlSharedFolder = this.appSettings.Value.UrlSharedFolder
			};

            return View(model);
        }

        private static IEnumerable<SelectListItem> ConvertToSelectListItem<T>(IEnumerable<T> listado, string value, string text) {
            return listado.Select(x => new SelectListItem() { Text = x.GetType().GetProperty(text).GetValue(x, null).ToString(), Value = x.GetType().GetProperty(value).GetValue(x, null).ToString() });
        }

		[HttpGet]
		public async Task<IActionResult> GetTemplatesCommunications([FromQuery] string productId, [FromQuery] string productName)
		{
			var product = new SelectListItem { Value = productId, Text = productName };

			var result = await this.templateMaintenanceCommunicationsService.GetList(product).ConfigureAwait(false);
			var templates = new List<SelectListItem>();
			foreach (var item in result)
			{
				templates.Add(new SelectListItem { Text = item.FileName, Value = item.TemplateId.ToString() });
			}
			return Ok(templates);
		}

		[HttpGet]
		public async Task<IActionResult> GetEventsTemplate([FromQuery] int templateId)
		{
			var result = await this.eventsTemplatesService.GetEventsTemplates(templateId).ConfigureAwait(false);
			var templates = new List<SelectListItem>();
			if (result != null) {
				foreach (var item in result)
				{
					templates.Add(new SelectListItem { Text = item.EventName, Value = item.IdEvent.ToString() });
				}
			}
			return Ok(templates);
		}


		[HttpGet]
		public async Task<IActionResult> GetDistributor() {
			var distributors = await this.communicationsService.GetDistributors().ConfigureAwait(false);
			var result = distributors.Select(x => new SelectListItem { Text = x.Name, Value = x.IdDistributor.ToString() });
			var resultList = new List<SelectListItem>();
			resultList.Add(new SelectListItem() { Text = "Sin distribuidora", Value = "-1" });
			resultList.AddRange(result);
			return Ok(resultList);
		}

		[HttpGet]
		public async Task<ActionResult> GetAllClients(int productId, int templateId, int eventId, string nifNiePasaporte, string nameSurname, int marketerId, string segment) {
			var search = new CommunicationClient
			{
				ProductId = productId,
				TemplateId = templateId,
				EventTemplateId = eventId,
				NIF = nifNiePasaporte,
				NameSurname = nameSurname,
				MarketerId = marketerId,
				Segment = segment
			};
			var allClients = await this.communicationsService.GetAllClients(search).ConfigureAwait(false);
			return Ok(allClients);
		}

		[HttpPost]
		public async Task<ActionResult> LoadDataTable(SearchModel model)
		{
			if (model.Limit == 0)
				model.Limit = 500;

			var results = new List<string[]>();

			var displayedItems = GetEmptyResponse();

			var paginatedSearch = new PaginatedSearch<CommunicationClient>
			{
				Limit = model.Limit,
				Offset = model.Offset,
				Sort = new Sort
				{
					SortDirection = SortDirection.Asc,
					SortField = "IdClient"
				},
				Search = new CommunicationClient
				{
					ProductId = model.ProductIdSelected,
					TemplateId = model.TemplateIdSelected,
					EventTemplateId = model.EventIdSelected,
					NIF = model.NifNiePasaporte,
					NameSurname = model.NameSurname,
					MarketerId = model.MarketerIdSelected,
					Segment = model.Segment
				}
			};

			var paginatedClients = await this.communicationsService.GetClients(paginatedSearch).ConfigureAwait(false);
			if (paginatedClients != null) {
				displayedItems = new ResultList<CommunicationClient>(paginatedClients.Items.ToList(), model.Limit, paginatedClients.Total);
			}
			
			if (displayedItems.List != null && displayedItems.List.Count != 0)
				results = GetFormatedResults(displayedItems);

			return Json(new
			{
				model.SEcho,
				iTotalRecords = displayedItems.TotalCount,
				iTotalDisplayRecords = displayedItems.TotalCount,
				aaData = results
			});
		}

		private static ResultList<CommunicationClient> GetEmptyResponse()
		{
			return new ResultList<CommunicationClient>([], 0, 0);
		}

		public List<string[]> GetFormatedResults(ResultList<CommunicationClient> clients)
		{
			var result = new List<string[]>();

            foreach (var item in clients.List)
            {
				result.Add(new string[]
				{
				   item.Id.ToString(),
				   item.NIF,
				   item.NameSurname,
				   item.IdAccount.ToString(),
				   item.Marketer,
				   item.Segment
				 });
            }
            return result;
		}

		[HttpPost]
        public async Task<IActionResult> GenerateDocuments(int clientId, int templateId, int eventId, string templateName, int productId, string productName, int executionId, int accountId, string documentNumber)
        {
            var parameters = new CommunicationParameters
			{ 
				IdClient = clientId,
				IdExecution = executionId,
				IdTemplate = templateId,
				TemplateName = templateName,
				ProductName = productName,
				IdEvent = eventId,
				IdProduct = productId,
				IdAccount = accountId,
                DocumentNumber = documentNumber
            };
			var result = await this.communicationsService.GenerateDocuments(parameters).ConfigureAwait(false);
			return Ok(result);
		}

		[HttpPost]
		public async Task<IActionResult> InitializeGenerateDocuments(string excludedClients, int idDistributor, int idEvent, int idProduct, string segment, string completeName, string documentNumber, int templateId) {
			var communicationParameters = new CommunicationParameters
			{
				DocumentNumber = documentNumber,
				CompleteName = completeName,
				ExcludedClients = excludedClients,
				IdDistributor = idDistributor,
				IdEvent = idEvent,
				IdProduct = idProduct,
				Segment = segment,
				IdTemplate = templateId
            };
			var result = await this.communicationsService.InitializeGenerateDocuments(communicationParameters).ConfigureAwait(false);
			return Ok(result);
		}

		[HttpPost]
		public async Task UpdateInfoGenerated([FromQuery] int idExecution, [FromQuery] int numDocsGenerated, [FromQuery]int numClientsSelected) {
			await this.communicationsService.UpdateInfoGenerated(idExecution, numDocsGenerated, numClientsSelected).ConfigureAwait(false);
		}

		[HttpGet]
		public async Task<IActionResult> PreviewTemplate([FromQuery] int clientId, [FromQuery] int accountId, [FromQuery] int eventId, [FromQuery] int productId, [FromQuery] int templateId, [FromQuery] string documentNumber, [FromQuery] string productName, [FromQuery] string templateName, [FromQuery] int distributorId, [FromQuery] string segment)
		{
			var communicationParameters = new CommunicationParameters { 
				IdClient = clientId,
				IdEvent = eventId,
				IdAccount = accountId,
				IdProduct = productId,
				ProductName = productName,
				TemplateName = templateName,
				DocumentNumber = documentNumber,
				ExcludedClients = string.Empty,
				Name = string.Empty,			// No se filtra por nombre y apellidos, ya que no se sabe como dividirlo.
				FirstSurname = string.Empty,
				SecondSurname = string.Empty,
				Segment = segment,
				IdTemplate = templateId,
				IdDistributor = distributorId,
            };
			byte[] template = await templateMaintenanceCommunicationsService.PreviewTemplate(communicationParameters).ConfigureAwait(false);
			
			if (template == null)
			{
				return StatusCode((int)HttpStatusCode.Moved);
			}
			var templatebase = Convert.ToBase64String(template);

			return Ok(templatebase);
		}
	}
}
