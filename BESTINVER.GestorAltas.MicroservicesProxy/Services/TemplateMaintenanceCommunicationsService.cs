using BestInver.WebPrivada.Shared.Models.Microservices.Communications;
using BestInver.WebPrivada.Shared.Models.Microservices.TemplateCommunications;
using BestInver.WebPrivada.Shared.Models.Microservices.TemplateMaintenance;
using BestInver.WebPrivada.Shared.Models.Shared;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class TemplateMaintenanceCommunicationsService: ITemplateMaintenanceCommunicationsService
    {
        private readonly IApiWebPrivadaHelper api;
        private const string TemplateBase = "api/documentMaintenanceCommunications";


        public TemplateMaintenanceCommunicationsService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public async Task<IEnumerable<TemplateCommunicationsUploadRequest>> GetList(SelectListItem product)
            => await api.GetWebAPI<IEnumerable<TemplateCommunicationsUploadRequest>>($"{TemplateBase}/templateList/{product.Value}/{product.Text}");

        public async Task<byte[]> DownloadTemplate(string templateName, string productName)
           => await api.GetStreamAPI($"{TemplateBase}/{templateName}/{productName}");

		public async Task<byte[]> PreviewTemplate(CommunicationParameters communicationParameters) 
            => await api.PostStreamAPI<CommunicationParameters>($"{TemplateBase}/PreviewTemplate/", communicationParameters);

		public async Task<bool> DeleteTemplate(string templateName, string productName, string productId)
           => await api.DeleteWebAPI<bool>($"{TemplateBase}/{templateName}/{productName}/{productId}");

        public async Task<bool> UploadTemplate(TemplateCommunicationsUploadRequest templateCommunication)
            => await api.PostWebAPI<bool, TemplateCommunicationsUploadRequest>($"{TemplateBase}/uploadTemplate/", templateCommunication);

        public async Task<IEnumerable<PdfFields>> GetTemplateFields(string templateName, string productName)
            => await api.GetWebAPI<IEnumerable<PdfFields>>($"{TemplateBase}/templateFieldsType/{templateName}/{productName}");

        public async Task<byte[]> FillTemplate(string templateName, string productName, List<PdfFields> data)
            => await api.PostStreamAPI($"{TemplateBase}/fillTemplate/{templateName}/{productName}", data);
    }
}
