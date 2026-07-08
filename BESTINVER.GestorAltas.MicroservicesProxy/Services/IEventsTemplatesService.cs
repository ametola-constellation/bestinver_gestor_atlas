using BestInver.WebPrivada.Shared.Models.Microservices.Communications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
	public interface IEventsTemplatesService
	{
		Task<IEnumerable<EventTemplate>> GetEventsTemplates(int templateId);
	}
}
