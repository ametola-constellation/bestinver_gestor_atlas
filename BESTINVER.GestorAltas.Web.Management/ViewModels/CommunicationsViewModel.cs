using BestInver.WebPrivada.Shared.Models.Microservices.Communications;
using BestInver.WebPrivada.Shared.Models.Microservices.Products;
using BestInver.WebPrivada.Shared.Models.Microservices.TemplateCommunications;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Management.ViewModels
{
    public class CommunicationsViewModel : BaseSearchQuery
	{
        public List<CommunicationProduct> ProductList { get; set; }
        public List<SelectListItem> Products { get; set; }
        public int ProductIdSelected { get; set; }
        public List<TemplateCommunication> TemplateList { get; set; }
        public List<SelectListItem> Templates { get; set; }
        public int TemplateIdSelected { get; set; }
        public List<EventTemplate> EventList { get; set; }
        public List<SelectListItem> Events { get; set; }
        public int EventIdSelected { get; set; }
        public string NifNiePasaporte { get; set; }
        public string NameSurname { get; set; }
		public List<SelectListItem> Marketer { get; set; }
		public List<SelectListItem> MarketerList { get; set; }
        public int MarketerIdSelected { get; set; }
		public string Segment { get; set; }
        public int MaxClientsToGenerate { get; set; }
        public string UrlSharedFolder { get; set; }
	}
}
