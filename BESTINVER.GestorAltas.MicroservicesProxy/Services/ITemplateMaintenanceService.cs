using BestInver.WebPrivada.Shared.Models.Microservices.TemplateMaintenance;
using BestInver.WebPrivada.Shared.Models.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface ITemplateMaintenanceService
    {
       Task<IEnumerable<TemplateMaintenance>> GetList();

       Task<byte[]> DownloadTemplate(string templateName);

       Task<bool> DeleteTemplate(string templateName);

        Task<bool> UpdateTemplate(string files, string filename);

        Task<IEnumerable<PdfFields>> GetTemplateFields(string templateName); 

        Task<byte[]> FillTemplate(string templateName, List<PdfFields> data);        
    }
}
