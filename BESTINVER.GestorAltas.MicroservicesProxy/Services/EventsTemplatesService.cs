using BestInver.WebPrivada.Shared.Models.Microservices.Communications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
	public class EventsTemplatesService: IEventsTemplatesService
	{
		private readonly IApiWebPrivadaHelper api;
		private const string EventsTemplatesBase = "api/EventsTemplates";


		public EventsTemplatesService(IApiWebPrivadaHelper apiWebPrivadaHelper)
		{
			api = apiWebPrivadaHelper;
		}

		public Task<IEnumerable<EventTemplate>> GetEventsTemplates(int templateId)
			=> api.GetWebAPI<IEnumerable<EventTemplate>>($"{EventsTemplatesBase}/EventTemplateList/{templateId}");
	}
}
