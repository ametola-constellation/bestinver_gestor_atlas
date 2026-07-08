using BestInver.WebPrivada.Shared.Models.Microservices.Portfolios;
using BestInver.WebPrivada.Shared.Models.Microservices.Products;
using BestInver.WebPrivada.Shared.Models.Microservices.TemplateMaintenance;
using BestInver.WebPrivada.Shared.Models.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{

    public class TemplateMaintenanceService : ITemplateMaintenanceService
    {
        private readonly IApiWebPrivadaHelper api;
        private const string TemplateBase = "api/documentMaintenance";


        public TemplateMaintenanceService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;            
        }

        public Task<IEnumerable<TemplateMaintenance>> GetList()
            => api.GetWebAPI<IEnumerable<TemplateMaintenance>>($"{TemplateBase}/templateList");

        public Task<byte[]> DownloadTemplate(string templateName)
           => api.GetStreamAPI($"{TemplateBase}/{templateName}"); 

        public Task<bool> DeleteTemplate(string templateName)
           => api.DeleteWebAPI<bool>($"{TemplateBase}/{templateName}");

        public async Task<bool> UpdateTemplate(string files, string filename)
        {
            var resultString = await api.PostWebAPI($"{TemplateBase}/updateTemplate/{filename}", files);
            bool result;
            if (bool.TryParse(resultString, out result))
            {
                return result;
            }
            return false;
        }

        public Task<IEnumerable<PdfFields>> GetTemplateFields(string templateName)
            => api.GetWebAPI<IEnumerable<PdfFields>>($"{TemplateBase}/templateFieldsType/{templateName}");

        public Task<byte[]> FillTemplate(string templateName, List<PdfFields> data)
            => api.PostStreamAPI($"{TemplateBase}/fillTemplate/{templateName}", data);
    }
}
