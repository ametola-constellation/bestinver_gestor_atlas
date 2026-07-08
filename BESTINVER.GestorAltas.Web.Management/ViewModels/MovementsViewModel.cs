using BESTINVER.GestorAltas.Web.Management.Models;
using BESTINVER.GestorAltas.Web.Management.Models.Movements;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.ViewModels
{
    public class MovementsViewModel
    {
        //public List<TemplateMaintenancemetadata> TemplateList { get; set; }
        //public List<SelectListItemmetadata> Templates { get; set; }
        public List<MovementsTemporal> Movements { get; set; }
        public string Date { get; set; }
        public IFormFile File { get; set; }
        public List<SelectListItem> Products { get; set; }
        public List<SelectListItem> ProductsExcel { get; set; }
        public int? Product { get; set; }
        public ExcelLoadModel ExcelLoadModel { get; set; }
        public string Concept { get; set; }
        public string Amount { get; set; }
        public int Status { get; set; }
        public string Order { get; set; }
        public int? Show { get; internal set; }
        //public RequestDashboardViewModel requestDashboard{ get; set; }
    }
}
