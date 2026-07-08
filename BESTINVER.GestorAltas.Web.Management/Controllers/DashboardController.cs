using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.Models.Dashboard;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace BESTINVER.GestorAltas.Web.Management.Controllers
{
    [Authorize]
    public class DashboardController : TimezoneController
    {
        private readonly string[] cols = {
            "",
            "",
            $"{nameof( BestInver.WebPrivada.Shared.Models.Microservices.Requests.Request)}.{nameof( BestInver.WebPrivada.Shared.Models.Microservices.Requests.Request.RequestStartDate)}",
            "",
            "",
            "",
            "" };

        private readonly IDashboardService dashboardService;
        private readonly IMapper mapper;
        private readonly IEnumerable<int> channels = new RequestChannelType[] { RequestChannelType.Publica }.ToList().Cast<int>();
        private readonly IOptions<AppSettings> appSettings;

        public DashboardController(IDashboardService dashboardService, IMapper mapper, IOptions<AppSettings> appSettings)
        {
            this.dashboardService = dashboardService;
            this.mapper = mapper;
            this.appSettings = appSettings;
        }

        public IActionResult Index()
        {
            if (!HasDashboardAccess())
                return Forbid();

            return View();
        }

        public async Task<IActionResult> LoadLockedRequestTable(JQueryDataTableParamModel p)
        {
            var filter = new PaginatedSearch<RequestDashboardSearch>
            {
                Search = new RequestDashboardSearch
                {
                    LockedBy = User.Identity.Name,
                    RequestChannel = channels
                },
                Limit = p.IDisplayLength,
                Offset = p.IDisplayStart,
                Sort = new Sort
                {
                    SortField = cols[p.ISortCol_0],
                    SortDirection = (p.SSortDir_0 == "asc"
                 ? BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection.Asc
                 : BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection.Desc)
                }
            };
            var displayedItems = await dashboardService
                .Search(filter)
                .ConfigureAwait(false);

            var results = mapper.Map<IEnumerable<TableResultModel>>(displayedItems);
            return JsonTableResults(p, displayedItems, results);
        }

        public async Task<ActionResult> LoadPendingRequestTable(JQueryDataTableParamModel p)
        {
            var filter = new PaginatedSearch<RequestDashboardSearch>
            {
                Search = new RequestDashboardSearch
                {
                    Pending = true,
                    NotInStatus = (new RequestStatusEnum[] { RequestStatusEnum.Register, RequestStatusEnum.Expired, RequestStatusEnum.Canceled, RequestStatusEnum.Abandoned }).ToList().Cast<int>(),
                    RequestChannel = channels
                },
                Limit = p.IDisplayLength,
                Offset = p.IDisplayStart,
                Sort = new Sort
                {
                    SortField = cols[p.ISortCol_0],
                    SortDirection = (p.SSortDir_0 == "asc"
                 ? BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection.Asc
                 : BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection.Desc)
                }
            };

            var displayedItems = await dashboardService
                .Search(filter)
                .ConfigureAwait(false);

            var results = mapper.Map<IEnumerable<TableResultModel>>(displayedItems);
            return JsonTableResults(p, displayedItems, results);
        }

        public async Task<IActionResult> LoadSignAlertsRequestTable(JQueryDataTableParamModel p)
        {
            var filter = new PaginatedSearch<RequestDashboardSearch>
            {
                Search = new RequestDashboardSearch
                {
                    SignAlerts = true,
                    NotInStatus = (new RequestStatusEnum[] { RequestStatusEnum.Register, RequestStatusEnum.Expired, RequestStatusEnum.Canceled, RequestStatusEnum.Abandoned }).ToList().Cast<int>(),
                    RequestChannel = channels
                },
                Limit = p.IDisplayLength,
                Offset = p.IDisplayStart,
                Sort = new Sort
                {
                    SortField = cols[p.ISortCol_0],
                    SortDirection = (p.SSortDir_0 == "asc"
                   ? BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection.Asc
                   : BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection.Desc)
                }
            };

            var displayedItems = await dashboardService
                 .Search(filter)
                 .ConfigureAwait(false);

            var results = mapper.Map<IEnumerable<TableResultModel>>(displayedItems);
            return JsonTableResults(p, displayedItems, results);
        }

        public async Task<IActionResult> LoadPBCAlertsRequestTable(JQueryDataTableParamModel p)
        {
            var filter = new PaginatedSearch<RequestDashboardSearch>
            {
                Search = new RequestDashboardSearch
                {
                    PBCAlerts = true,
                    NotInStatus = (new RequestStatusEnum[] { RequestStatusEnum.Register, RequestStatusEnum.Expired, RequestStatusEnum.Canceled, RequestStatusEnum.Abandoned }).ToList().Cast<int>(),
                    RequestChannel = channels
                },
                Limit = p.IDisplayLength,
                Offset = p.IDisplayStart,
                Sort = new Sort
                {
                    SortField = cols[p.ISortCol_0],
                    SortDirection = (p.SSortDir_0 == "asc"
                   ? BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection.Asc
                   : BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection.Desc)
                }
            };
            var displayedItems = await dashboardService
                .Search(filter)
                .ConfigureAwait(false);

            var results = mapper.Map<IEnumerable<TableResultModel>>(displayedItems);
            return JsonTableResults(p, displayedItems, results);
        }

        public async Task<IActionResult> LoadIncidenceAlertsRequestTable(JQueryDataTableParamModel p)
        {
            var filter = new PaginatedSearch<RequestDashboardSearch>
            {
                Search = new RequestDashboardSearch
                {
                    IncidenceAlerts = true,
                    RequestChannel = channels
                },
                Limit = p.IDisplayLength,
                Offset = p.IDisplayStart == 0 ? default(int?) : p.IDisplayStart,
                Sort = new Sort
                {
                    SortField = cols[p.ISortCol_0],
                    SortDirection = (p.SSortDir_0 == "asc"
                  ? BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection.Asc
                  : BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection.Desc)
                }
            };

            var displayedItems = await dashboardService
                .Search(filter)
                .ConfigureAwait(false);

            var results = mapper.Map<IEnumerable<TableResultModel>>(displayedItems);
            return JsonTableResults(p, displayedItems, results);
        }

        public async Task<IActionResult> LoadDniPendingSolveRequestTable(JQueryDataTableParamModel p)
        {
            var filter = new PaginatedSearch<RequestDashboardSearch>
            {
                Search = new RequestDashboardSearch
                {
                    ValidateUploadDocs = true,
                    Status = (int)RequestStatusEnum.PendingDNI,
                    RequestChannel = channels
                },
                Limit = p.IDisplayLength,
                Offset = p.IDisplayStart,
                Sort = new Sort
                {
                    SortField = cols[p.ISortCol_0],
                    SortDirection = (p.SSortDir_0 == "asc"
                 ? BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection.Asc
                 : BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection.Desc)
                }
            };

            var displayedItems = await dashboardService
                .Search(filter)
                .ConfigureAwait(false);

            var results = mapper.Map<IEnumerable<TableResultModel>>(displayedItems);
            return JsonTableResults(p, displayedItems, results);
        }

        public async Task<IActionResult> LoadPostalRequestTable(JQueryDataTableParamModel p)
        {
            var filter = new PaginatedSearch<RequestDashboardSearch>
            {
                Search = new RequestDashboardSearch
                {
                    IdSendingWay = (int)SendingWayType.EnviarCorreoPostal,
                    SendDocumentAlerts = true,
                    Status = (int)RequestStatusEnum.PendingSignature,
                    RequestChannel = channels
                },
                Limit = p.IDisplayLength,
                Offset = p.IDisplayStart,
                Sort = new Sort
                {
                    SortField = cols[p.ISortCol_0],
                    SortDirection = (p.SSortDir_0 == "asc"
                 ? BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection.Asc
                 : BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection.Desc)
                }
            };

            var displayedItems = await dashboardService
                .Search(filter)
                .ConfigureAwait(false);

            var results = mapper.Map<IEnumerable<TableResultModel>>(displayedItems);
            return JsonTableResults(p, displayedItems, results);
        }

        private bool HasDashboardAccess()
        {
            var settings = appSettings.Value.Dashboard;
            if (settings == null)
                return false;

            if (settings.AllowedRoles?.Count > 0 && !settings.AllowedRoles.Exists(r => User.IsInRole(r)))
                return false;

            return true;
        }

        private ActionResult JsonTableResults<TModel>(JQueryDataTableParamModel p, PaginatedResult<RequestDashboard> displayedItems, IEnumerable<TModel> results)
            where TModel : TableResultModel
        {
            return Json(new JsonTableResultsModel
            {
                SEcho = p.SEcho,
                ITotalRecords = displayedItems.Total,
                ITotalDisplayRecords = displayedItems.Total,
                AaData = results.Select(x => x.ToTable())
            });
        }
    }
}