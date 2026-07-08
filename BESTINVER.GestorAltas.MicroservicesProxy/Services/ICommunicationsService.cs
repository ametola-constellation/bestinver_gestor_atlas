using BestInver.WebPrivada.Shared.Models.Microservices.Communications;
using BestInver.WebPrivada.Shared.Models.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
	public interface ICommunicationsService
	{
		Task<IEnumerable<CommunicationClient>> GetAllClients(CommunicationClient filters);
		Task<PaginatedResult<CommunicationClient>> GetClients(PaginatedSearch<CommunicationClient> filters);
		Task<IEnumerable<Distributor>> GetDistributors();
		Task<CommunicationParameters> InitializeGenerateDocuments(CommunicationParameters communicationParameters);
		Task<CommunicationGenerateDocument> GenerateDocuments(CommunicationParameters communicationGenerateDocument);
		Task UpdateInfoGenerated(int idExecution, int numDocsGenerated, int numClientsSelected);
		Task<IEnumerable<CommunicationProduct>> GetCommunicationsProducts();
	}
}
