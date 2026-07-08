using Bestinver.Auth.Ldap.Identity.Models;
using BestInver.WebPrivada.Shared.Models.Backend.Customers.Enums;
using BestInver.WebPrivada.Shared.Models.Backend.Tests.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.AdviceProduct;
using BestInver.WebPrivada.Shared.Models.Microservices.Portfolios;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using BestInver.WebPrivada.Shared.Models.Services.RdFile;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Request;
using BestInver.WebPrivada.Shared.Models.Shared;
using BestInver.WebPrivada.Shared.Models.Shared.Enums;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Utilities.Enums;
using BESTINVER.GestorAltas.Web.Management.Models.FcrFunds;
using BESTINVER.GestorAltas.Web.Management.Models.Operation;
using BESTINVER.GestorAltas.Web.Management.Models.PeriodicsOperations;
using BESTINVER.GestorAltas.Web.Management.ViewModels;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Controllers
{
    [Authorize(MiddleOfficeClaimNames.SolicitudConsulta)]
    public class FCRFundsController : TimezoneController
    {
        private readonly IPortfoliosService portfoliosService;
        private readonly IProductService productService;
        private readonly IOperationsService operationService;
        private readonly ICustomersService customersService;
        private readonly IDashboardService dashboardService;
        private readonly IRequestService requestService;
        private readonly IEnumerable<int> channels = new RequestChannelType[] { RequestChannelType.Privada, RequestChannelType.MasProductos, RequestChannelType.MiddleOffice }.ToList().Cast<int>();
        private readonly ISignaturesService signaturesService;
        private readonly IAdviceProductService adviceProductService;
        private readonly IFilesService filesService;
        private readonly ILogger<FCRFundsController> logger;
        private readonly IOptions<Domain.Configurations.AppSettings> appSettings;


        public FCRFundsController(
            IPortfoliosService portfoliosService,
            IProductService productService,
            IOperationsService operationService,
            ICustomersService customersService,
            IDashboardService dashboardService,
            IRequestService requestService,
            ISignaturesService signaturesService,
            IAdviceProductService adviceProductService,
            IFilesService filesService,
            ILogger<FCRFundsController> logger,
            IOptions<Domain.Configurations.AppSettings> appSettings
            ) : base()
        {
            this.portfoliosService = portfoliosService;
            this.productService = productService;
            this.operationService = operationService;
            this.customersService = customersService;
            this.dashboardService = dashboardService;
            this.requestService = requestService;
            this.signaturesService = signaturesService;
            this.adviceProductService = adviceProductService;
            this.filesService = filesService;
            this.logger = logger;
            this.appSettings = appSettings;
        }

        // GET: FCRFundsController
        public ActionResult Index()
        {
            var model = new RequestDashboardViewModel()
            {
                SalesChannel = (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.SalesChannelType.MiddleOffice
            };

            return View(model);
        }

        [HttpGet]
        public IActionResult ShowSendPreviousDocumentation()
        {
            return PartialView("_CreateNewFCRFundView");
        }

        [HttpGet]
        public async Task<IActionResult> ShowCreateNewSubscriptionFCRAsync(int idAccount)
        {
            var model = new RequestFCRFundModel()
            {
                AreConditionsAccepted = false,
                IsEmployee = false
            };

            model.AccountId = idAccount;

            var accountCustomers = await portfoliosService.GetAccountData(idAccount).ConfigureAwait(false);
            var owner = accountCustomers.Where(x => x.CustomerType.Id.ToString() == CustomerTypeEnum.Owner).AsEnumerable().FirstOrDefault();
            model.Username = User.Identity.Name;
            model.DocumentNumber = owner.Customer.DocumentNumber;
            model.CustomerId = (int)owner.Customer.Id;

            var applicants = GetRequestApplicants(accountCustomers);
            CheckApplicantsInfo(applicants, accountCustomers);
            model.Applicants = applicants.OrderBy(a => a.ApplicantRoleType.Id).ToList();

            var products = await productService.GetProduct().ConfigureAwait(false);
            var filteredProducts = products.Where(x => x.FamilyProductId == 12 && x.Show == true).ToList();

            ViewBag.Products = filteredProducts;

            var accountProducts = await portfoliosService.GetAccountProducts(model.CustomerId, idAccount).ConfigureAwait(false);
            model.AccountProducts = accountProducts ?? new List<AccountProduct>();

            var paginatedSearch = new PaginatedSearch<RequestAdviceProductSearch>
            {
                Limit = 1,
                Offset = 0,
                Sort = new Sort
                {
                    SortDirection = SortDirection.Desc,
                    SortField = "Request.RequestSignedDate"
                },
                Search = new RequestAdviceProductSearch
                {
                    IdAccount = idAccount.ToString(),
                }
            };

            var searchResult = await adviceProductService.Search(paginatedSearch).ConfigureAwait(false);
            var lastAdviceDate = searchResult.Items.FirstOrDefault()?.RequestSignDate;
            model.AdviceRequestId = searchResult.Items.FirstOrDefault()?.Id;
            model.LastAdvice = lastAdviceDate;
            model.ValidAdvice = lastAdviceDate.HasValue && lastAdviceDate.Value >= DateTime.UtcNow.AddDays(-appSettings.Value.LastAdviceValidDays);
            model.AccountCustomers = accountCustomers;

            //var products = await productService.GetProductConfigFoundType().ConfigureAwait(false);
            //ViewBag.FoundTypes = products.Where(x => x.ProductId == (int)ProductNames.BESTINVER_PRIVATE_EQUITY);

            return PartialView("_FCRFundDetailsView", model);
        }

        private void CheckApplicantsInfo(IEnumerable<RequestApplicant> applicants, List<AccountCustomer> accountCustomers)
        {
            foreach (var applicant in applicants.Select(reqApplicant => reqApplicant.Applicant))
            {
                var accountCustomer = accountCustomers.FirstOrDefault(c => c.Customer.DocumentNumber.Equals(applicant.DNI));
                if (accountCustomer != null)
                {
                    applicant.MobilePhoneNumber = accountCustomer.Customer.MobilePhone;
                    applicant.Email = accountCustomer.Customer.Mail;
                }
            }
        }

        private List<RequestApplicant> GetRequestApplicants(List<AccountCustomer> accountCustomers)
        {
            var result = new List<RequestApplicant>();
            var personTypes = new List<string>();

            foreach (var ac in accountCustomers)
            {
                if (!result.Any(a => a.Applicant.DNI == ac.Customer.DocumentNumber))
                {
                    var role = MapToMOCustomerTypeId(
                        ac.CustomerType.Id,
                        accountCustomers.Any(acs => acs.Customer.Id == ac.Customer.Id && acs.CustomerType.Id == CustomerTypeEnum.Tutor),
                        ac.Order.Value);

                    result.Add(new RequestApplicant()
                    {
                        Applicant = new Applicant()
                        {
                            DNI = ac.Customer.DocumentNumber,
                            Email = ac.Customer.Mail,
                            MobilePhoneNumber = ac.Customer.Phone,
                            Name = ac.Customer.Name,
                            FirstSurname = ac.Customer.Surname1,
                            SecondSurname = ac.Customer.Surname2,
                            Birthday = ac.Customer.BirthDate
                        },
                        ApplicantRoleType = new ApplicantRole()
                        {
                            Id = role,
                            Description = ((ApplicantRoleType)role).ToString()
                        }
                    });

                    personTypes.Add(ac.Customer.PersonTypeId.ToString());
                }
            }

            ViewBag.PersonTypes = personTypes;

            return result;
        }

        [HttpPost]
        public async Task<IActionResult> SendDocumentation([FromForm] RequestFCRFundModel model)
        {
            var requestModel = new OperationForCreated() { CustomerDocumentNumber = model.DocumentNumber, Amount = (decimal)model.Amount, ProductId = model.ProductId, Username = model.Username, IsConvenient = model.IsConvenient, IsEmployee = model.IsEmployee, AdviceRequestId = model.AdviceRequestId, IsAdvice = model.Advice };
            var formData = new MultipartFormDataContent();

            var jsonContent = new StringContent(JsonConvert.SerializeObject(requestModel), Encoding.UTF8, "application/json");
            formData.Add(jsonContent, "jsonData");

            if (model.Files != null)
            {
                foreach (var file in model.Files)
                {
                    var fileContent = new StreamContent(file.OpenReadStream());
                    formData.Add(fileContent, "files", file.FileName);
                }
            }

            await operationService.CreateFCRFund(model.CustomerId.ToString(), model.AccountId.ToString(), formData);

            return RedirectToAction("Index", "FCRFunds");
        }


        #region PeriodicsOperations
        //Parte de código movida a este controlador desde PeriodicOperationsController debido a que desaparece el menu de operaciones periódicas
        [HttpPost]
        public async Task<JsonResult> SearchAccount([FromBody] CreatePeriodicOperation periodicOperation)
        {
            var tableList = new List<TableResultCreatePeriodicOperation>();
            if (!string.IsNullOrEmpty(periodicOperation.DNI))
            {
                var applicantRdIds = await customersService.GetCustomerByDNI(periodicOperation.DNI).ConfigureAwait(false);
                var accountCustomer = await portfoliosService.GetAccountByCustomer(int.Parse(applicantRdIds.ClientId)).ConfigureAwait(false);
                accountCustomer = accountCustomer.Where(ac => ac.Account.InactivityDate == null && (ac.Account.ExistsDeathInAccount == false || ac.Account.ExistsDeathInAccount == null));
                foreach (var accountId in accountCustomer.Select(a => a.Account.Id))
                {
                    if (accountId.HasValue && accountId.Value > 0)
                    {
                        var r = await GetRow(accountId.Value);
                        if (r != null) tableList.Add(r);
                    }
                }
            }

            return Json(tableList);
        }

        private async Task<TableResultCreatePeriodicOperation> GetRow(int accountId)
        {
            var accountCustomers = await portfoliosService.GetAccountById(accountId);

            var tableRow = new TableResultCreatePeriodicOperation();
            var ownersAccount = new Dictionary<string, string>();
            foreach (var ac in accountCustomers)
            {
                var descripcion = GetDescriptionCustomerType(ac.CustomerType.Id);
                if (ownersAccount.Any(o => o.Key.Equals(descripcion)))
                {
                    ownersAccount[descripcion] += "," + ac.Customer.CompleteName;
                }
                else
                {
                    ownersAccount.Add(descripcion, ac.Customer.CompleteName);
                }
            }
            tableRow.AccountId = accountId;
            tableRow.Owners = ownersAccount;
            return tableRow;
        }

        private string GetDescriptionCustomerType(string customerTypeId)
        {
            switch (customerTypeId)
            {
                case CustomerTypeEnum.Owner:
                case CustomerTypeEnum.CoOwner:
                    return "Titulares";
                case CustomerTypeEnum.Attorney:
                    return "Apoderados";
                case CustomerTypeEnum.Tutor:
                    return "Tutores";
                case CustomerTypeEnum.Authorized:
                    return "Autorizados";

                default:
                    return string.Empty;
            }
        }
        #endregion

        #region Operation
        //Se ha movido todo el código que puede llegar a necesitar operation.js ya que lo utiliza en FCRFunds
        [HttpPost]
        public async Task<ActionResult> LoadDataTable(SearchModel model)
        {
            if (model.Limit == 0)
            {
                model.Limit = 500;
            }

            var displayedItems = await CallWebAPI(model).ConfigureAwait(false);
            var results = from d in displayedItems.List
                          select new string[]
                          {
                              d.RequestID,
                              DateTime.SpecifyKind(d.RequestStartDate, DateTimeKind.Utc).ToString("O"),
                              d.RDCode,
                              d.Name,
                              d.Product,
                              d.OperationType,
                              d.Amount,
                              d.Status,
                              d.Comments,
                              d.IdRequestStatus,
                              d.IdOperationType,
                              d.IdProductType,
                              d.SignedDate.HasValue ? DateTime.SpecifyKind(d.SignedDate.Value, DateTimeKind.Utc).ToString("O") : null,
                              d.LifeCicleOk.HasValue && d.LifeCicleOk.Value ? "Si" : "No" ,
                              d.LifeCycleChanged.HasValue && d.LifeCycleChanged.Value ? "Si" : "No",
                              (User.IsInRole(DefaultRoles.Juridico) || User.IsInRole(DefaultRoles.Admin)).ToString().ToLower(),
                              d.IdOperation,
                              d.IdProduct,
                              d.IsForeignAccount.HasValue && d.IsForeignAccount.Value ? "Si" : "No",
                              d.InitialPeriodicDate?.ToString("dd/MM/yyyy"),
                              d.ExternalCode,
                          };

            return Json(new
            {
                model.SEcho,
                iTotalRecords = displayedItems.TotalCount,
                iTotalDisplayRecords = displayedItems.TotalCount,
                aaData = results
            });
        }

        private async Task<ResultList<OperationSearchRequestModel>> CallWebAPI(RequestDashboardViewModel model)
        {
            var notInStatusList = model.OperationType != null ? new List<int>
            {
                (int)RequestStatusEnum.Periodic_NotStarted,
                (int)RequestStatusEnum.Periodic_Started,
                (int)RequestStatusEnum.Periodic_Confirmed,
                (int)RequestStatusEnum.Periodic_IncomingTransfer,
                (int)RequestStatusEnum.Periodic_ProcesedManual,
                (int)RequestStatusEnum.Periodic_Error,
                (int)RequestStatusEnum.Periodic_Cancelled,
            }
            :
            null;

            var notInSalesChannelList = new List<int>
            {
                (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.SalesChannelType.MiddleOffice
            };

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
                    StartDate = model.StartDate,
                    EndDate = model.EndDate,
                    ProductType = model.ProductType,
                    Product = model.Product,
                    Status = model.Status,
                    OperationType = model.OperationType,
                    DNI = model.DNI,
                    FirstSureName = model.FirstSurname,
                    SecondSureName = model.SecondSurname,
                    RDCode = model.RDCode,
                    FromPrice = model.FromPrice,
                    ToPrice = model.ToPrice,
                    Price = model.Price,
                    RequestChannel = channels,
                    FileNameRD = model.Document,
                    PayerName = model.PayerName,
                    LifeCicleOk = model.LifeCicleOk,
                    LifeCycleChanged = model.LifeCycleChanged,
                    Name = model.Name,
                    InitialPeriodicDate = model.InitialPeriodicDate,
                    ExternalCode = model.ExternalCode,
                    NotInStatus = model.OperationType == null ? notInStatusList : null,
                    IdOperation = model.IdOperation,
                    SalesChannel = model.SalesChannel,
                    NotInSalesChannel = model.ExcludeSalesChannel.HasValue && model.ExcludeSalesChannel.Value ? notInSalesChannelList : null
                }
            };
            var searchResult = await dashboardService.Search(paginatedSearch).ConfigureAwait(false);
            var items = searchResult.Items.Select(x =>
            {
                return new OperationSearchRequestModel
                {
                    RequestID = x.Id.ToString(),
                    RequestStartDate = x.RequestStartDate,
                    RDCode = x.RDCode,
                    Name = x.ApplicantName,
                    Product = x.GetSingleProduct(),
                    OperationType = x.GetOperationType(),
                    Amount = x.GetSingleAmount(),
                    Status = x.GetStatus(),
                    IdProductType = x.GetSingleProductTypeId().ToString(),
                    Comments = x.GetStatusComments(),
                    IdOperationType = x.GetOperationTypeId().ToString(),
                    IdRequestStatus = x.GetIdStatus(),
                    SignedDate = x.RequestSignedDate,
                    LifeCicleOk = x.LifeCicleOk,
                    LifeCycleChanged = x.LifeCycleChanged,
                    IdOperation = x.GetFirstOperationId().ToString(),
                    IdProduct = x.GetSingleProductId().ToString(),
                    IsForeignAccount = x.IsForeignAccount(),
                    InitialPeriodicDate = x.GetInitialPeriodicDate(),
                    ExternalCode = x.GetExternalCode()
                };
            }).ToList();
            return new ResultList<OperationSearchRequestModel>(items, items.Count, searchResult.Total);
        }

        public class SearchModel : RequestDashboardViewModel
        {
            private readonly string[] columns = [
                "",
                "Request.RequestStartDate"
            ];

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

        [HttpGet]
        public async Task<ActionResult> OperationDetail(Guid requestID)
        {
            var applicants = await requestService.GetRequestApplicants(requestID).ConfigureAwait(false);

            return PartialView("~/Views/FCRFunds/_OperationApplicantsDataView.cshtml", applicants);
        }

        [HttpPost]
        public async Task<ActionResult> SolveRequestStatusOperation(Guid requestID, bool accepted)
        {
            bool result;

            try
            {
                result = await requestService.SolveOperationAlert(requestID, accepted).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                result = false;
                logger.LogError(ex, "{Message}", ex.Message);
            }

            return Json(new
            {
                result
            });
        }

        [HttpPost]
        public ActionResult ShowInfo(OperationInfoModel model)
        {
            return PartialView("_OperationShowInfoDataView", model);
        }

        [HttpPost]
        public async Task<ActionResult> CreateFileOperations(OperationInfoModel model)
        {
            bool result = true;

            try
            {
                if (string.IsNullOrEmpty(User.Identity.Name))
                    throw new Exception("Sesión caducada");

                var file = new RdFileRequest
                {
                    RequestIds = model.RequestIds,
                    ValuationDate = model.LiquidativeDate,
                    ProcessingType = RdProcessingType.Manual,
                    UserName = User.Identity.Name
                };

                var idopetask = await filesService.IdOpe(file).ConfigureAwait(false);
                var idsoltask = await filesService.IdSol(file).ConfigureAwait(false);
                var idpertask = await filesService.IdPer(file).ConfigureAwait(false);
            }
            catch
            {
                result = false;
            }

            return Json(new
            {
                result
            });
        }

        [HttpPost]
        public async Task<ActionResult> ShowDocuments(Guid requestID)
        {
            var singStatus = new SignedStatus { RequestId = requestID.ToString(), SignerDNI = string.Empty };
            var documentsFromEcertic = await signaturesService.GetDocumentSignedStatus(singStatus).ConfigureAwait(false);
            var model = new List<OperationDocumentModel>();

            if (documentsFromEcertic?.DocFiles != null && documentsFromEcertic?.Signers != null
                && documentsFromEcertic?.DocFiles.Count > 0 && documentsFromEcertic?.Signers.Count > 0)
            {
                int numSigners = (int)documentsFromEcertic?.Signers.Count;

                for (int i = 0; i < numSigners; i++)
                {
                    var signerdocument = new OperationDocumentModel();
                    var signer = documentsFromEcertic?.Signers[i];
                    var documents = documentsFromEcertic?.DocSignedFiles[i];
                    signerdocument.Dni = signer.Dni;
                    signerdocument.Name = signer.Name;

                    List<OperationDocument> docs = [];
                    foreach (var doc in documents)
                    {
                        docs.Add(new OperationDocument
                        {
                            Name = doc.Filename,
                            Url = GetPublicUrlDownloadDocument(doc.Url, appSettings.Value.Aes256Key)
                        });
                    }

                    signerdocument.Documents = docs;
                    model.Add(signerdocument);
                }
            }

            return PartialView("_OperationShowDocumentsDataView", model);
        }

        #endregion
        private static int MapToMOCustomerTypeId(string role, bool andIsTuror, int order)
        {
            if (role.Equals(CustomerTypeEnum.Owner) && !andIsTuror && order == 1)
            {
                return MapToMOCustomerTypeId(CustomerTypeEnum.Owner);
            }
            if (role.Equals(CustomerTypeEnum.Owner) && !andIsTuror && order != 1)
            {
                return MapToMOCustomerTypeId(CustomerTypeEnum.CoOwner);
            }
            if (role.Equals(CustomerTypeEnum.Owner) && andIsTuror && order == 1)
            {
                return (int)ApplicantRoleType.TitularAndTutor;
            }
            if (role.Equals(CustomerTypeEnum.Owner) && andIsTuror && order != 1)
            {
                return (int)ApplicantRoleType.CotitularAndTutor;
            }

            return MapToMOCustomerTypeId(role);
        }

        private static int MapToMOCustomerTypeId(string rdCustomerType)
        {
            switch (rdCustomerType)
            {
                case CustomerTypeEnum.Owner:
                    return (int)ApplicantRoleType.Titular;
                case CustomerTypeEnum.CoOwner:
                    return (int)ApplicantRoleType.Cotitular;
                case CustomerTypeEnum.Authorized:
                    return (int)ApplicantRoleType.Autorizado;
                case CustomerTypeEnum.Administrator:
                    return (int)ApplicantRoleType.Administrador;
                case CustomerTypeEnum.RealOwner:
                    return (int)ApplicantRoleType.TitularReal;
                case CustomerTypeEnum.Attorney:
                    return (int)ApplicantRoleType.Apoderado;
                case CustomerTypeEnum.Tutor:
                    return (int)ApplicantRoleType.Tutor;
                case CustomerTypeEnum.Usufructuary:
                    return (int)ApplicantRoleType.Beneficiario;
                case CustomerTypeEnum.DirectiveBoard:
                    return (int)ApplicantRoleType.JuntaDirectiva;
                default:
                    return (int)ApplicantRoleType.Autorizado;
            }
        }
    }
}
