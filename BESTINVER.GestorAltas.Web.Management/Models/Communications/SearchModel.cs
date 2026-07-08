using BESTINVER.GestorAltas.Utilities.Enums;
using BESTINVER.GestorAltas.Web.Management.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace BESTINVER.GestorAltas.Web.Management.Models.Communications
{
	public class SearchModel : CommunicationsViewModel
	{
		private readonly string[] columns = {
			"",
			"Request.SentSignDate"
		};

		[BindProperty(Name = "sEcho")]
		public string SEcho { get; set; }

		[BindProperty(Name = "sSortDir_0")]
		public override OrderDir OrderDir
		{
			get => base.OrderDir;
			set => base.OrderDir = value;
		}

		[BindProperty(Name = "iSortCol_0")]
		public override string OrderBy
		{
			get => base.OrderBy;
			set => base.OrderBy = columns[int.Parse(value)];
		}

		[BindProperty(Name = "iDisplayLength")]
		public override int Limit
		{
			get => base.Limit;
			set => base.Limit = value;
		}

		[BindProperty(Name = "iDisplayStart")]
		public override int Offset
		{
			get => base.Offset;
			set => base.Offset = value;
		}
	}
}
