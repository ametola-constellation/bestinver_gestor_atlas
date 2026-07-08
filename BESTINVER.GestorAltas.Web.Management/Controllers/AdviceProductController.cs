using BestInver.WebPrivada.Shared.Models.Backend.Customers.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.AdviceProduct;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using BestInver.WebPrivada.Shared.Models.Shared;
using BestInver.WebPrivada.Shared.Models.Shared.Enums;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Utilities.Enums;
using BESTINVER.GestorAltas.Web.Management.Extensions;
using BESTINVER.GestorAltas.Web.Management.Models.AdviceProduct;
using BESTINVER.GestorAltas.Web.Management.ViewModels;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Controllers
{
    [Authorize(MiddleOfficeClaimNames.SolicitudConsulta)]
    public class AdviceProductController : TimezoneController
    {
        public readonly IAdviceProductService _adviceProductService;
        private readonly IPortfoliosService _portfoliosService;
        private readonly ICustomersService _customersService;
        private readonly IRequestService _requestService;


        public AdviceProductController(IAdviceProductService adviceProductService, ICustomersService customersService, IPortfoliosService portfoliosService, IRequestService requestService)
        {
            _adviceProductService = adviceProductService;
            _customersService = customersService;
            _portfoliosService = portfoliosService;
            _requestService = requestService;
        }
        public async Task<IActionResult> Index()
        {
            var model = new RequestAdviceProductViewModel();
            var requestStatusTypes = await _requestService.GetRequestStatusTypes();
            var excludedStatuses = new[]
            {
                (int)RequestStatusEnum.Canceled,
                (int)RequestStatusEnum.Rejected,
                (int)RequestStatusEnum.Representatives_Sign,
                (int)RequestStatusEnum.PendingAutomaticProcess,
                (int)RequestStatusEnum.PendingMoneyLaundering,
                (int)RequestStatusEnum.Anulled,
                (int)RequestStatusEnum.Executed,
                (int)RequestStatusEnum.ProcessedAutomatic,
                (int)RequestStatusEnum.ProcessedManual,
                (int)RequestStatusEnum.Partially_Executed_Output,
                (int)RequestStatusEnum.Periodic_ProcesedManual,
                (int)RequestStatusEnum.Periodic_NotStarted,
                (int)RequestStatusEnum.Periodic_Started,
                (int)RequestStatusEnum.Periodic_Confirmed,
                (int)RequestStatusEnum.Periodic_IncomingTransfer,
                (int)RequestStatusEnum.Periodic_Error,
                (int)RequestStatusEnum.Periodic_Cancelled
            };
            model.RequestStatusTypes = requestStatusTypes
                .Where(x => !excludedStatuses.Contains(x.Id))
                .Select(x => new SelectItemModel
                {
                    Id = x.Id.ToString(),
                    Description = x.Name
                }).ToList();
            return View(model);
        }

        [HttpGet]
        public IActionResult ShowSendPreviousDocumentation()
        {
            return PartialView("_CreateNewAdviceProductView");
        }

        [HttpGet]
        public IActionResult ShowCreateNewAdviceProductAsync(int idAccount, string documentNumber, string customerFullName)
        {
            var model = new AdviceProductDocumentsModel();
            if (idAccount != 0)
            {
                model.IdAccount = idAccount.ToString();
            }
            else
            {
                model.IdAccount = "Nueva";
            }

            model.DocumentNumber = documentNumber;
            model.CustomerFullName = customerFullName;
            model.Username = System.Web.HttpContext.Current.User.Identity.Name;
            model.CanGenerate = true;

            return PartialView("_AdviceProductAttachmentDocumentView", model);
        }


        [HttpPost]
        public async Task<ActionResult> LoadDataTable(SearchModel model)
        {
            if (model.Limit == 0)
            {
                model.Limit = 500;
            }

            // Si el filtro de fecha fin está establecido, se suma un día y se resta un segundo para incluir las solicitudes de ese día completo, ya que el filtro se realiza con hora 00:00:00
            if (model.EndDate.HasValue)
            {
                model.EndDate = model.EndDate.Value.AddDays(1).AddSeconds(-1);
            }

            var displayedItems = await CallWebAPI(model).ConfigureAwait(false);
            var results = from d in displayedItems.List
                          select new string[]
                          {
                              d.RequestID,
                              DateTime.SpecifyKind(d.RequestStartDate, DateTimeKind.Utc).ToString("O"),
                              d.IdAccount,
                              d.Name,
                              _adviceProductService.GetTextSuitableColumn(new () { RequestID = d.RequestID, DocumentNumber = d.DocumentNumber, Suitable = d.Suitable, RequestStatusId = int.Parse(d.IdRequestStatus), IdAccount = d.IdAccount, CustomerFullName = d.Name } ),
                              d.Status,
                              d.SignedDate.HasValue ? DateTime.SpecifyKind(d.SignedDate.Value, DateTimeKind.Utc).ToString("O") : null
                          };
            return Json(new
            {
                model.SEcho,
                iTotalRecords = displayedItems.TotalCount,
                iTotalDisplayRecords = displayedItems.TotalCount,
                aaData = results
            });
        }


        [HttpPost]
        public async Task<IActionResult> SearchAccount([FromBody] CreateAdviceProduct periodicOperation)
        {
            var response = new Dictionary<string, object>
            {
                { "status", "" },
                { "idAccount", 0 },
                { "documentNumber", periodicOperation.DNI },
                { "customerFullName", ""}
            };

            if (!string.IsNullOrEmpty(periodicOperation.DNI))
            {
                var isPerson = await _adviceProductService.IsPerson(periodicOperation.DNI).ConfigureAwait(false);
                if (!isPerson)
                {
                    response["status"] = "error_not_person";
                    return Ok(response);
                }


                var applicantRdIds = await _customersService.GetCustomerByDNI(periodicOperation.DNI).ConfigureAwait(false);
                var accountCustomer = await _portfoliosService.GetAccountByCustomer(int.Parse(applicantRdIds.ClientId)).ConfigureAwait(false);
                accountCustomer = accountCustomer
                    .Where(ac => ac.Account.InactivityDate == null && (ac.Account.ExistsDeathInAccount == false || ac.Account.ExistsDeathInAccount == null))
                    .Where(ac => ac.Customer.Id == int.Parse(applicantRdIds.ClientId) && (ac.CustomerType.Id == CustomerTypeEnum.Owner || ac.CustomerType.Id == CustomerTypeEnum.CoOwner));
                if (accountCustomer.Any(x => x.Customer.BirthDate.IsMinor()))
                {
                    response["status"] = "error_minor";
                    return Ok(response);
                }

                foreach (var accountId in accountCustomer.Select(a => a.Account.Id))
                {
                    if (accountId.HasValue && accountId.Value > 0)
                    {
                        var accountCustomers = await _portfoliosService.GetAccountById(accountId.Value);

                        if (accountCustomers is not null)
                        {
                            var customer = accountCustomers.First(c => c.Customer.DocumentNumber == periodicOperation.DNI);
                            response["customerFullName"] = $"{customer.Customer?.Name} {customer.Customer?.Surname1} {customer.Customer?.Surname2}".Trim();

                            var hasCoOwner = accountCustomers.Any(x => x.CustomerType.Id == CustomerTypeEnum.CoOwner) ||
                                             accountCustomers.Count(x => x.CustomerType.Id == CustomerTypeEnum.Owner) > 1;
                            // Solo se habilita con un único titular. Si tiene Cootitulares no se puede asesorar con esa cuenta, por lo que se crea una nueva.
                            if (!hasCoOwner)
                            {
                                bool pendingRequest = await _adviceProductService.HasRequestPending(customer.Customer.DocumentNumber, accountId.Value.ToString()).ConfigureAwait(false);

                                if (!pendingRequest)
                                {
                                    response["status"] = "success";
                                    response["idAccount"] = accountId.Value;

                                    return Ok(response);
                                }
                                else
                                {
                                    response["status"] = "error_pending_request";
                                    return Ok(response);
                                }
                            }
                        }
                    }
                }

                if (accountCustomer.Any())
                {
                    //Caso de cuenta nueva (mas productos), si es titular en alguna cuenta, aunque no es una cuenta con un unico titular, se hace el alta de cuenta
                    response["status"] = "success";
                    return Ok(response);
                }
            }
            response["status"] = "error_no_account";
            return Ok(response);
        }


        [HttpPost]
        public async Task<IActionResult> SaveDocuments([FromForm] AdviceProductDocumentsRequestModel model)
        {
            var isSuitable = model.IsSuitable;

            bool filesValid = isSuitable
                ? model.Contract is not null && model.Proposal is not null && model.Suitability is not null
                : model.Suitability is not null;

            if (!filesValid)
            {
                return BadRequest(new { message = "Faltan documentos requeridos según la idoneidad del cliente." });
            }

            var adviceRequestData = new AdviceRequestData
            {
                DocumentNumber = model.DocumentNumber,
                IdRequest = model.RequestID,
                LoggedUser = model.Username,
                Suitable = isSuitable
            };

            if (!string.IsNullOrEmpty(model.IdAccount) && int.TryParse(model.IdAccount, out int idAccount))
            {
                adviceRequestData.IdAccount = idAccount;
            }

            adviceRequestData.Files = new List<IFormFile> { model.Suitability };

            if (isSuitable)
            {
                adviceRequestData.Files.Insert(0, model.Contract);
                adviceRequestData.Files.Add(model.Proposal);
            }

            if (model.OtherFiles is not null && model.OtherFiles.Count > 0)
            {
                adviceRequestData.Files.AddRange(model.OtherFiles);
            }

            var result = await _adviceProductService.SaveDocuments(adviceRequestData);

            return Ok(result);
        }


        private async Task<ResultList<AdviceProductSearchRequestModel>> CallWebAPI(RequestAdviceProductViewModel model)
        {
            var paginatedSearch = new PaginatedSearch<RequestAdviceProductSearch>
            {
                Limit = model.Limit,
                Offset = model.Offset,
                Sort = new Sort
                {
                    SortDirection = (SortDirection)model.OrderDir,
                    SortField = model.OrderBy
                },
                Search = new RequestAdviceProductSearch
                {
                    DNI = model.DNI,
                    Name = model.Name,
                    FirstSureName = model.FirstSurname,
                    SecondSureName = model.SecondSurname,
                    StartDate = model.StartDate,
                    EndDate = model.EndDate,
                    Status = model.Status,
                    IdAccount = model.IdAccount,
                }
            };

            var searchResult = await _adviceProductService.Search(paginatedSearch).ConfigureAwait(false);
            var items = searchResult.Items.Select(x =>
            {
                return new AdviceProductSearchRequestModel
                {
                    RequestID = x.Id.ToString(),
                    RequestStartDate = (DateTime)x.RequestStartDate,
                    IdAccount = x.IdAccount,
                    Name = x.ApplicantName,
                    SignedDate = x.RequestSignDate,
                    Status = x.GetStatus(),
                    IdRequestStatus = x.GetIdStatus(),
                    Suitable = x.Suitable,
                    DocumentNumber = x.DocumentNumber
                };
            }).ToList();

            return new ResultList<AdviceProductSearchRequestModel>(items, items.Count, searchResult.Total);
        }

        [HttpGet]
        public async Task<IActionResult> ShowAttachmentDocumentsModal(string requestID, string idAccount, string documentNumber, string customerFullName)
        {
            var hasRequestDocuments = await _adviceProductService.HasRequestDocuments(requestID, documentNumber).ConfigureAwait(false);

            var model = new AdviceProductDocumentsModel
            {
                RequestID = requestID,
                IdAccount = idAccount,
                DocumentNumber = documentNumber,
                CustomerFullName = customerFullName,
                CanGenerate = hasRequestDocuments,
                Username = System.Web.HttpContext.Current.User.Identity.Name
            };

            return PartialView("_AdviceProductAttachmentDocumentView", model);
        }

        public class SearchModel : RequestAdviceProductViewModel
        {
            private readonly string[] columns = {
                "",
                "Request.RequestStartDate"
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
