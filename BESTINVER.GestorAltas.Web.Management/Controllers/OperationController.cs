using AutoMapper;
using Bestinver.Auth.Ldap.Identity.Models;
//using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BestInver.WebPrivada.Shared.Models.Backend.Tests.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using BestInver.WebPrivada.Shared.Models.Services.RdFile;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Request;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Utilities.Enums;
using BESTINVER.GestorAltas.Web.Management.Models;
using BESTINVER.GestorAltas.Web.Management.Models.Operation;
using BESTINVER.GestorAltas.Web.Management.ViewModels;
using BESTINVER.GestorAltas.Web.Models;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Controllers
{
    [Authorize(MiddleOfficeClaimNames.SolicitudConsulta)]
    public class OperationController : TimezoneController
    {
        private readonly IDashboardService dashboardService;
        private readonly IRequestService requestService;
        private readonly IFilesService filesService;
        private readonly ILogger<OperationController> logger;
        private readonly IOptions<AppSettings> appSettings;
        private readonly IMapper mapper;
        private readonly IProductService productService;
        private readonly ISignaturesService signaturesService;
        private readonly IOperationsService operationsService;
        private readonly IEnumerable<int> channels = new RequestChannelType[] { RequestChannelType.Privada, RequestChannelType.MasProductos, RequestChannelType.MiddleOffice }.ToList().Cast<int>();

        public OperationController(
            IDashboardService dashboardService,
            IRequestService requestService,
            IMapper mapper,
            IFilesService filesService,
            IProductService productService,
            ILogger<OperationController> logger,
            IOptions<AppSettings> appSettings,
            ISignaturesService signaturesService,
            IOperationsService operationsService)
        {
            this.dashboardService = dashboardService;
            this.requestService = requestService;
            this.filesService = filesService;
            this.logger = logger;
            this.appSettings = appSettings;
            this.mapper = mapper;
            this.productService = productService;
            this.signaturesService = signaturesService;
            this.operationsService = operationsService;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var Products = await productService.GetProduct().ConfigureAwait(false);

            var model = new RequestDashboardViewModel
            {
                Products = mapper.Map<List<SelectListItem>>(Products),
                Status = 12,
                ExcludeSalesChannel = true
            };

            return View(model);
        }

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

            return PartialView("~/Views/Operation/_OperationApplicantsDataView.cshtml", applicants);
        }

        [HttpGet]
        public async Task<ActionResult> StatusDetail(Guid requestID)
        {
            var requestStatus = await requestService.GetStatuses(requestID).ConfigureAwait(false);
            var status = requestStatus.OrderByDescending(r => r.StartDate).FirstOrDefault();
            var resuls = mapper.Map<RequestStatusModel>(status);
            return PartialView("_OperationStatusDataView", resuls);
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
        public async Task<ActionResult> CreateOrUpdateStatusOperation(RequestStatus model)
        {
            bool result;

            try
            {
                model.Responsible = User.Identity.Name;
                result = await requestService.CreateOrUpdateStatus(model).ConfigureAwait(false);
            }
            catch (Exception)
            {
                result = false;
            }

            return Json(new
            {
                result
            });
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
                logger.LogError("{Message}", ex.Message);
            }

            return Json(new
            {
                result
            });
        }

        [HttpGet]
        public async Task<ActionResult> GetPDF(OperationInfoModel model)
        {
            var search = new RequestSearch
            {
                RequestCollection = model.RequestIds
            };

            var requestcollection = await requestService.GetRequestCollection(search).ConfigureAwait(false);

            model.Requests = requestcollection.ToList();

            byte[] result;

            var document = new Document();
            document.SetMargins(25, 25, 25, 25);

            using (MemoryStream ms = new())
            {
                PdfWriter.GetInstance(document, ms);
                document.Open();

                var table = new PdfPTable(4)
                {
                    WidthPercentage = 100
                };

                var cellProductHeader = new PdfPCell(new Phrase("Producto"))
                {
                    BackgroundColor = new BaseColor(181, 153, 113),
                    BorderWidth = 0,
                    HorizontalAlignment = 1 //0=Left, 1=Centre, 2=Right
                };
                table.AddCell(cellProductHeader);

                var cellOperationTypeHeader = new PdfPCell(new Phrase("Tipo de operación"))
                {
                    BackgroundColor = new BaseColor(181, 153, 113),
                    BorderWidth = 0,
                    HorizontalAlignment = 1 //0=Left, 1=Centre, 2=Right
                };
                table.AddCell(cellOperationTypeHeader);

                var cellAmountHeader = new PdfPCell(new Phrase("Importe"))
                {
                    BackgroundColor = new BaseColor(181, 153, 113),
                    BorderWidth = 0,
                    HorizontalAlignment = 1 //0=Left, 1=Centre, 2=Right
                };
                table.AddCell(cellAmountHeader);

                var cellForeignAccount = new PdfPCell(new Phrase("Extranjero"))
                {
                    BackgroundColor = new BaseColor(181, 153, 113),
                    BorderWidth = 0,
                    HorizontalAlignment = 1 //0=Left, 1=Centre, 2=Right
                };
                table.AddCell(cellForeignAccount);

                foreach (var request in requestcollection)
                {
                    var op = request.ProductOperations.FirstOrDefault();

                    var cellProduct = new PdfPCell(new Phrase(op.Product.Name))
                    {
                        BorderWidthLeft = 0,
                        BorderWidthTop = 0,
                        HorizontalAlignment = 0 //0=Left, 1=Centre, 2=Right
                    };
                    table.AddCell(cellProduct);

                    var cellOperationType = new PdfPCell(new Phrase(op.Operation.OperationType.Name))
                    {
                        BorderWidthLeft = 0,
                        BorderWidthTop = 0,
                        HorizontalAlignment = 0 //0=Left, 1=Centre, 2=Right
                    };
                    table.AddCell(cellOperationType);

                    var cellAmount = new PdfPCell(new Phrase(op.Operation.GetSingleAmount()))
                    {
                        BorderWidthLeft = 0,
                        BorderWidthRight = 0,
                        BorderWidthTop = 0,
                        HorizontalAlignment = 2 //0=Left, 1=Centre, 2=Right
                    };
                    table.AddCell(cellAmount);

                    var cellForeignAmount = new PdfPCell(new Phrase(op.Operation.IsForeignAccount() ? "Si" : "No"))
                    {
                        BorderWidthLeft = 0,
                        BorderWidthRight = 0,
                        BorderWidthTop = 0,
                        HorizontalAlignment = 2 //0=Left, 1=Centre, 2=Right
                    };
                    table.AddCell(cellForeignAmount);
                }

                document.Add(table);

                document.Close();
                result = ms.ToArray();
            }

            return File(result, "application/pdf");
        }

        [HttpPost]
        public async Task<ActionResult> ShowDocuments(Guid requestID)
        {
            var singStatus = new SignedStatus { RequestId = requestID.ToString(), SignerDNI = string.Empty };
            var model = new List<OperationDocumentModel>();

            try
            { 
                var documentsFromEcertic = await signaturesService.GetDocumentSignedStatus(singStatus).ConfigureAwait(false);

                if (documentsFromEcertic == null)
                {
                    logger.LogWarning("Documents not available (null response) for request {RequestId}. Host may be unknown or documents expired.", requestID);
                    return PartialView("_OperationShowDocumentsDataView", model);
                }

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
            }
            catch (HttpRequestException ex) when(ex.StatusCode == HttpStatusCode.Gone)
            {
                logger.LogWarning(ex, "Documents not available (410 Gone) for request {RequestId}. Host may be unknown or documents expired.", requestID);
                return PartialView("_OperationShowDocumentsDataView", model);
            }
            catch (Exception ex) when(ex.Message.Contains("410") || ex.Message.Contains("Gone"))
            {
                logger.LogWarning(ex, "Documents not available (410 Gone) for request {RequestId}. Host may be unknown or documents expired.", requestID);
                return PartialView("_OperationShowDocumentsDataView", model);
            }   
            catch (Exception)
            {
                return PartialView("_OperationShowDocumentsDataView", model);
            }

            return PartialView("_OperationShowDocumentsDataView", model);
        }

        [HttpGet]
        public async Task<ActionResult> ShowSignatureStatus(Guid requestID)
        {
            var applicants = await requestService.GetRequestApplicantsPendingSignature(requestID).ConfigureAwait(false);

            var model = mapper.Map<List<OperationApplicantSignatureModel>>(applicants);
            model.ForEach(a => a.RequestId = requestID);

            return PartialView("_OperationSignatureStatusDataView", model);
        }

        [HttpPost]
        public async Task<ActionResult> SendSignatureReplay(List<OperationApplicantSignatureModel> model)
        {
            var result = true;
            try
            {
                var requestId = model.FirstOrDefault().RequestId;
                List<Task> tasks = [];

                foreach (var ap in model)
                {
                    if (ap.SendSignatureReplay)
                        tasks.Add(signaturesService.ReplaySignature(requestId, ap.Applicant.DNI, false));
                }

                await Task.WhenAll(tasks).ConfigureAwait(false);
                return Json(new
                {
                    result
                });
            }
            catch
            {
                result = false;
                return Json(new
                {
                    result
                });
            }
        }

    }
}