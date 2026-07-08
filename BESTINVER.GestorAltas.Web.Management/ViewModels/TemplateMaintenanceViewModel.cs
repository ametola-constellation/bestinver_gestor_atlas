using BestInver.WebPrivada.Shared.Models.Microservices.TemplateMaintenance;
using BESTINVER.GestorAltas.Web.Management.Models.TemplateMaintenance;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.ViewModels
{
    public class TemplateMaintenanceViewModel
    {
        public List<TemplateMaintenance> TemplateList { get; set; }
        public List<SelectListItem> Templates { get; set; }
        public IFormFile File { get; set; }
    }
}
