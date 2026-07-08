using BestInver.WebPrivada.Shared.Models.Microservices.Communications;
using BestInver.WebPrivada.Shared.Models.Microservices.TemplateCommunications;
using BestInver.WebPrivada.Shared.Models.Shared;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
	public interface ITemplateMaintenanceCommunicationsService
    {
        Task<IEnumerable<TemplateCommunicationsUploadRequest>> GetList(SelectListItem product);
        Task<byte[]> DownloadTemplate(string templateName, string productName);
        Task<byte[]> PreviewTemplate(CommunicationParameters communicationParameters);
		Task<bool> DeleteTemplate(string templateName, string productName, string productId);
        Task<bool> UploadTemplate(TemplateCommunicationsUploadRequest templateCommunication);
        Task<IEnumerable<PdfFields>> GetTemplateFields(string templateName, string productName);
        Task<byte[]> FillTemplate(string templateName, string productName, List<PdfFields> data);
    }
}
