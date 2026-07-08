using BestInver.WebPrivada.Shared.Models.Microservices.Communications;
using BestInver.WebPrivada.Shared.Models.Shared;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
	public class CommunicationsService: ICommunicationsService
	{
		private readonly IApiWebPrivadaHelper api;
		private const string CommunicationBase = "api/Communications";


		public CommunicationsService(IApiWebPrivadaHelper apiWebPrivadaHelper)
		{
			api = apiWebPrivadaHelper;
		}

		public Task<IEnumerable<CommunicationClient>> GetAllClients(CommunicationClient filters) => api.PostWebAPI<IEnumerable<CommunicationClient>, CommunicationClient>($"{CommunicationBase}/AllClients/", filters);

		public Task<PaginatedResult<CommunicationClient>> GetClients(PaginatedSearch<CommunicationClient> filters) => api.PostWebAPI<PaginatedResult<CommunicationClient>, PaginatedSearch<CommunicationClient>>($"{CommunicationBase}/ClientList/", filters);

		public Task<IEnumerable<Distributor>> GetDistributors() => api.GetWebAPI<IEnumerable<Distributor>>($"{CommunicationBase}/Distributors");

		public Task<CommunicationParameters> InitializeGenerateDocuments(CommunicationParameters communicationParameters) => api.PostWebAPI<CommunicationParameters>($"{CommunicationBase}/GenerateCommunications", communicationParameters);

		public Task<CommunicationGenerateDocument> GenerateDocuments(CommunicationParameters communicationGenerateDocument) => api.PostWebAPI<CommunicationGenerateDocument, CommunicationParameters>($"{CommunicationBase}/GenerateDocuments", communicationGenerateDocument);

		public Task UpdateInfoGenerated(int idExecution, int numDocsGenerated, int numClientsSelected) => api.PostWebAPI<Task, Task>($"{CommunicationBase}/UpdateInfoGenerated/{idExecution}/{numDocsGenerated}/{numClientsSelected}", null);

		public Task<IEnumerable<CommunicationProduct>> GetCommunicationsProducts() => api.GetWebAPI<IEnumerable<CommunicationProduct>>($"{CommunicationBase}/CommunicationsProducts");
	}
}
