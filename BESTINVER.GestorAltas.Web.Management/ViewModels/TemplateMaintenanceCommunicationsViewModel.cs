using BestInver.WebPrivada.Shared.Models.Backend.Home.Products;
using BestInver.WebPrivada.Shared.Models.Microservices.TemplateMaintenance;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Management.ViewModels
{
    public class TemplateMaintenanceCommunicationsViewModel
    {
        public List<Product> ProductList { get; set; }
        public List<SelectListItem> Products { get; set; }
        public List<TemplateMaintenance> TemplateList { get; set; }
        public List<SelectListItem> Templates { get; set; }
        public int ProductSelected { get; set; }
        public string ProductNameSelected { get; set; }
        public IFormFile File { get; set; }
    }
}
