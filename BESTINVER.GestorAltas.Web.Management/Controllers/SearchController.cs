using BestInver.WebPrivada.Shared.Models.Microservices.Operations.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Products.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Utilities.Enums;
using BESTINVER.GestorAltas.Web.Management.Models;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Controllers
{
    [Authorize(MiddleOfficeClaimNames.SolicitudConsulta)]
    public class SearchController : TimezoneController
    {
        private readonly IDashboardService dashboardService;
        private readonly IProductService productService;
        private readonly IRequestService requestService;
        private readonly List<int> DeprecatedStatuses;

        public SearchController(IDashboardService dashboardService,
            IProductService productService,
            IRequestService requestService)
        {
            this.dashboardService = dashboardService;
            this.productService = productService;
            this.requestService = requestService;
            DeprecatedStatuses =
            [
                (int)RequestStatusEnum.PendingDNIVerification,
                (int)RequestStatusEnum.PendingMoney,
                (int)RequestStatusEnum.PendingSendRd
            ];
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var productsTask = productService.GetProduct();
            var productTypesTask = productService.GetProductTypes();
            var operationsTaks = requestService.GetRequestOperationTypes();
            var requestStatusTypes = requestService.GetRequestStatusTypes();
            var taskList = new List<Task>
            {
                productsTask,
                operationsTaks,
                productTypesTask,
                requestStatusTypes
            };

            await Task.WhenAll(taskList).ConfigureAwait(false);
            var products = productsTask.GetAwaiter().GetResult();
            var productTypes = productTypesTask.GetAwaiter().GetResult();
            var filter = new ApplicantSearchListModel
            {
                Filtered = 0,
                PersonTypes = SelectItemModel<string, string>.Build<BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.ApplicantType>(),
                DocumentSignatureTypes = SelectItemModel<string, string>.Build<DocumentSignatureType>(),
                SalesChannles = SelectItemModel<string, string>.Build<SalesChannelType>(),
                RequestAlertTypes = SelectItemModel<string, string>.Build<AlertTypes>(),
                FundStatuses = SelectItemModel<string, string>.Build<FundStatusType>(),
                RequestApplicantTypes = SelectItemModel<string, string>.Build<ApplicantRoleType>().Where(x =>
                {
                    var @enum = (ApplicantRoleType)Enum.Parse(typeof(ApplicantRoleType), x.Description);
                    return @enum == ApplicantRoleType.Heredero
                    || @enum == ApplicantRoleType.BeneficiarioDonacion
                    || @enum == ApplicantRoleType.Minusvalido;
                }).ToList(),
                Products = products.Where(p => p.ProductType.Id != ((int)ProductTypeMOEnum.Asesoramiento).ToString()).Select(x => new SelectItemModel { Id = x.MoProductId.ToString(), Description = x.Name }).ToList(),
                ProductsTypes = productTypes.Where(p => p.Id != ((int)ProductTypeMOEnum.Asesoramiento).ToString()).Select(x => new SelectItemModel { Id = x.Id, Description = x.Name }).ToList(),
                OperationTypes = operationsTaks.GetAwaiter().GetResult().Select(x => new SelectItemModel { Id = x.Id.ToString(), Description = x.Name })
                    .Where(x => int.Parse(x.Id) != (int)OperationTypeMOEnum.PeriodicSuscription 
                    || int.Parse(x.Id) != (int)OperationTypeMOEnum.PeriodicSuscriptionPsd2).ToList(),
                RequestStatusTypes = requestStatusTypes.GetAwaiter().GetResult().Select(x => new SelectItemModel { Id = x.Id.ToString(), Description = x.Name })
                    .Where(x => 
                        (int.Parse(x.Id) < (int)RequestStatusEnum.Periodic_NotStarted || int.Parse(x.Id) > (int)RequestStatusEnum.Partially_Executed_Output)
                        && int.Parse(x.Id) != (int)RequestStatusEnum.Adendas
                        && !DeprecatedStatuses.Contains(int.Parse(x.Id))
                    ).ToList()
            };

            return View(filter);
        }

        [HttpPost]
        public async Task<IActionResult> LoadDataTable(SearchModel model)
        {
            if (model.Limit == 0)
            {
                model.Limit = 500;
            }

            var displayedItems = await CallWebAPI(model).ConfigureAwait(false);
            var results = from d in displayedItems.List
                          select new[] {
                              d.RequestID.ToString(),
                              d.FriendlyID,
                              DateTime.SpecifyKind(d.RequestStartDate, DateTimeKind.Utc).ToString("O"),
                              d.Name?.ToString(),
                              d.NIF,
                              d.Status?.ToString(),
                              (d.TerroristAlert?"<span class='badge badge-danger'>T</span>":"") +
                              (d.PBCAlerts?"<span class='badge badge-danger'>PBC</span>":"" ) +
                              (d.OtherAlerts?"<span class='badge badge-warning'>O</span>":"") +
                              (d.SignAlerts?"<span class='badge badge-warning'>F</span>":""),
                              d.LockedBy
                          };

            return Json(new
            {
                model.SEcho,
                iTotalRecords = displayedItems.TotalCount,
                iTotalDisplayRecords = displayedItems.TotalCount,
                aaData = results
            });
        }

        private async Task<ResultList<ManagementSearchRequestModel>> CallWebAPI(ApplicantSearchListModel model)
        {
            IEnumerable<int> channels = new RequestChannelType[] { RequestChannelType.Publica }.ToList().Cast<int>();
            int? status = model.Status;

            if (model.Type is not null && model.Type != (int)RequestChannelType.Publica)
            {
                channels = new RequestChannelType[] { RequestChannelType.Privada, RequestChannelType.MasProductos }.ToList().Cast<int>();
                status = (int)RequestStatusEnum.ErrorSendingToOperations;
            }

            var paginatedSearch = new PaginatedSearch<RequestDashboardSearch>
            {
                Limit = model.Limit,
                Offset = model.Offset,
                Sort = new Sort
                {
                    SortDirection = (BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection)model.OrderDir,
                    SortField = model.OrderBy
                },
                Search = new RequestDashboardSearch
                {
                    
                    DNI = string.IsNullOrEmpty(model.DNI) ? model.DNI : model.DNI.Trim(),
                    DocStatus = model.DocStatus,
                    EndDate = model.EndDate,
                    FirstSureName = model.FirstSurname,
                    FromPrice = model.FromPrice,
                    FundStatus = model.FundStatus,
                    IdSendingWay = model.IdSendingWay,
                    IDSolicitud = model.IDSolicitud,
                    IncidenceAlerts = model.IncidenceAlerts,
                    LockedBy = model.LockedBy,
                    ManagedByCommercial = model.ManagedByCommercial,
                    Name = model.Name,
                    NotInStatus = model.NotInStatus,
                    OperationType = model.OperationType,
                    PBCAlerts = model.PBCAlerts,
                    Pending = model.Pending,
                    Product = model.Product,
                    ProductType = model.ProductType,
                    RequestApplicantType = model.RequestApplicantType,
                    RequestChannel = channels,
                    SalesChannel = model.SalesChannel,
                    SecondSureName = model.SecondSurname,
                    SendDocumentAlerts = model.SendDocumentAlerts,
                    SignAlerts = model.SignAlerts,
                    SignStatus = model.SignStatus,
                    SignType = model.SignType,
                    StartDate = model.StartDate,
                    Status = status,
                    TerroristAlerts = model.TerroristAlerts,
                    ToPrice = model.ToPrice,
                    Username = model.Username,
                    ValidateUploadDocs = model.ValidateUploadDocs,
                    PersonType = model.PersonType,
                    RequestAlertType = model.RequestAlertType
                }
            };
            var searchResult = await dashboardService.Search(paginatedSearch).ConfigureAwait(false);
            var items = searchResult.Items.Select(x =>
            {
                var requestStatusType = x.Status.OrderByDescending(s => s.StartDate).FirstOrDefault()?.StatusType.Name;
                return new ManagementSearchRequestModel
                {
                    NIF = x.ApplicantDNI,
                    Name = x.ApplicantName,
                    FriendlyID = x.IdRequest,
                    RequestID = x.Id,
                    Status = requestStatusType,
                    PBCAlerts = x.Alerts.Any(a => (a.AlertType?.Id == (int)AlertTypes.AlertaPersonaPublica || (a.AlertType?.Id == (int)AlertTypes.AlertaPBC) && !a.EndDate.HasValue)),
                    SignAlerts = x.Alerts.Any(a => a.AlertType?.Id == (int)AlertTypes.AlertaEnvioDocumentacion && !a.EndDate.HasValue),
                    TerroristAlert = x.Alerts.Any(a => a.AlertType?.Id == (int)AlertTypes.AlertaTerrorismo && !a.EndDate.HasValue),
                    OtherAlerts = x.Alerts.Any(a => (a.AlertType?.Id != (int)AlertTypes.AlertaPersonaPublica
                    && a.AlertType?.Id != (int)AlertTypes.AlertaTerrorismo
                    && a.AlertType?.Id != (int)AlertTypes.AlertaPBC)
                    && !a.EndDate.HasValue),
                    LockedBy = x.LockedBy,
                    AssistedBy = x.AssistedBy,
                    ProductTypes = x.ProductTypes.Select(p => p.ToString()).ToArray(),
                    RequestStartDate = x.RequestStartDate,
                };
            }).ToList();
            return new ResultList<ManagementSearchRequestModel>(items, items.Count, searchResult.Total);
        }

        public class SearchModel : ApplicantSearchListModel
        {
            private readonly string[] columns = {
            "",
            "Request.RequestStartDate",
            "",
            ""
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
}