using AutoMapper;
using Bestinver.Auth.Ldap.Identity.Models;
using BestInver.WebPrivada.Shared.Models.Backend.Customers.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Alerts;
using BestInver.WebPrivada.Shared.Models.Microservices.Customers;
using BestInver.WebPrivada.Shared.Models.Microservices.Operations.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Portfolios;
using BestInver.WebPrivada.Shared.Models.Microservices.Products.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Representatives;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BestInver.WebPrivada.Shared.Models.Middleware.MiddleOffice;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Request;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Response;
using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.MicroservicesProxy.Models;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Resource.Localization;
using BESTINVER.GestorAltas.Web.Management.Models;
using BESTINVER.GestorAltas.Web.Management.Models.Details;
using BESTINVER.GestorAltas.Web.Management.ViewModels;
using BESTINVER.GestorAltas.Web.Models;
using BESTINVER.GestorAltas.Web.Models.Applicants;
using BESTINVER.GestorAltas.Web.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using ApplicantRoleType = BestInver.WebPrivada.Shared.Models.Backend.Customers.Enums.ApplicantRoleType;

namespace BESTINVER.GestorAltas.Web.Management.Controllers
{
    [Route("[controller]/[action]")]
    [Authorize(MiddleOfficeClaimNames.SolicitudConsulta)]
    public class DetailsController : TimezoneController
    {
        private readonly ICustomersService customerService;
        private readonly IRequestService requestService;
        private readonly ITestService testService;
        private readonly ISignUpService singupService;
        private readonly ISignaturesService signaturesService;
        private readonly ILogger<DetailsController> logger;
        private readonly IMapper mapper;
        private readonly IAlertService alertService;
        private readonly IOptions<AppSettings> appSettings;
        private readonly IStringLocalizer<Strings> stringLocalizer;
        private readonly IRegisterService registerService;
        private readonly IApplicantService applicantService;
        private readonly ISignUpService signUpService;
        private readonly ISendMailService sendMailService;
        private readonly IAmlService amlService;
        private readonly IRepresentativesService _representativesService;
        private readonly IProductService productService;
        private readonly IPortfoliosService portfoliosService;
        private readonly IOperationsService operationsService;

        public DetailsController(IAlertService alertService,
            IRequestService requestService,
            ITestService testService,
            ISignUpService singupService,
            ISignaturesService signaturesService,
            ILogger<DetailsController> logger,
            IMapper mapper,
            IOptions<AppSettings> appSettings,
            IStringLocalizer<Strings> stringLocalizer,
            IRegisterService registerService,
            IApplicantService applicantService,
            ISignUpService signUpService,
            ISendMailService sendMailService,
            IAmlService amlService,
            ICustomersService CustomersService,
            IRepresentativesService representativesService,
            IProductService productService,
            IPortfoliosService portfoliosService,
            IOperationsService operationsService)
        {
            this.requestService = requestService;
            this.testService = testService;
            this.singupService = singupService;
            this.signaturesService = signaturesService;
            this.logger = logger;
            this.mapper = mapper;
            this.alertService = alertService;
            this.appSettings = appSettings;
            this.stringLocalizer = stringLocalizer;
            this.registerService = registerService;
            this.applicantService = applicantService;
            this.signUpService = signUpService;
            this.sendMailService = sendMailService;
            this.amlService = amlService;
            this.customerService = CustomersService;
            this._representativesService = representativesService;
            this.productService = productService;
            this.portfoliosService = portfoliosService;
            this.operationsService = operationsService;
        }

        public async Task<ActionResult> Index(Guid requestID)
        {
            var requestTaks = requestService.GetRequest(requestID);
            var reqeustStatusTask = requestService.GetStatuses(requestID);
            var alertsTask = alertService.Search(new RequestAlertMOSearch
            {
                IdRequest = requestID
            });
            var alertTypes = alertService.GetAllAlertTypes();
            var masterDataTask = singupService.GetMasterdata();
            await Task.WhenAll(alertsTask, requestTaks, reqeustStatusTask, alertTypes, masterDataTask).ConfigureAwait(false);
            var request = requestTaks.GetAwaiter().GetResult();
            var model = mapper.Map<ManagementRequestModel>(request);
            var alerts = alertsTask.GetAwaiter().GetResult();

            model.Alerts = mapper.Map<List<RequestAlertModel>>(alerts);
            model.Status.ForEach(s => s.IDRequestFriendly = model.Request.IdRequest);
            model.AlertTypes = mapper.Map<List<SelectItemModel>>(alertTypes.GetAwaiter().GetResult());

            var status = mapper.Map<List<RequestStatusModel>>(reqeustStatusTask.GetAwaiter().GetResult());
            model.Status = status.OrderBy(s => s.StartDate).ToList();

            var masterData = masterDataTask.GetAwaiter().GetResult();
            model.Countries = mapper.Map<List<SelectItemModel>>(masterData.Countries);
            model.Genders = mapper.Map<List<SelectItemModel>>(masterData.Genders);

            model.DocumentTypes = SelectItemModel<string, string>.Build<DocumentType>();
            model.Nationalities = mapper.Map<List<SelectItemModel>>(masterData.Nationalities);
            model.ViaTypes = mapper.Map<List<SelectItemModel>>(masterData.ViaType);
            model.ApplicantType = SelectItemModel<string, string>.Build<BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.ApplicantType>();
            model.TimeZone = TimeZone;

            var FCRoperation = model.ProductOperations.FirstOrDefault(po => po.IdProduct == (int)ProductNames.BESTINVER_INFRA);

            if (FCRoperation != null)
            {
                var amount = FCRoperation.Operations.FirstOrDefault()?.Amount;

                model.Request.FoundClass = await productService.GetProductOperationClass(FCRoperation.IdProduct, amount, model.Request.IsEmployee).ConfigureAwait(false);
            }

            await ConfigureRepresentativesButtons(request, model);
            return View(model);
        }

        [HttpPost]
        [Authorize(Policy = MiddleOfficeClaimNames.SolicitudModificacion)]
        public IActionResult SendPartialRD()
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        [Authorize(Policy = MiddleOfficeClaimNames.SolicitudModificacion)]
        public IActionResult SendCompletePartialRD()
        {
#pragma warning disable RECS0083 // Shows NotImplementedException throws in the quick task bar
#pragma warning disable RCS1079 // Throwing of new NotImplementedException.
            throw new NotImplementedException();
#pragma warning restore RCS1079 // Throwing of new NotImplementedException.
#pragma warning restore RECS0083 // Shows NotImplementedException throws in the quick task bar
        }

        private static void CheckRequestId(Guid requestId)
        {
            if (requestId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(requestId));
            }
        }

        public async Task<IActionResult> GetOperationDetails(Guid idRequest, int idOperation)
        {
            var requestOperation = await requestService.GetRequestOperation(idOperation).ConfigureAwait(false);

            var model = mapper.Map<UpdateRequestOperationModel>(requestOperation);
            model.MaxAmount = requestOperation.Product.AdultMax;
            model.MinAmount = requestOperation.Product.AdultMin;
            model.RequestId = idRequest;

            return PartialView("_OperationDetailsView", model);
        }

        [HttpPost]
        public async Task<ActionResult> UpdateOperation(UpdateRequestOperationModel model)
        {
            var requestOperation = await requestService.GetRequestOperation(model.Id).ConfigureAwait(false);

            Decimal amount = Convert.ToDecimal(model.Importe.Replace(",", "."), CultureInfo.InvariantCulture);

            requestOperation.Operation.Amount = amount;
            requestOperation.Operation.FundReceived = model.FondoRecibido;
            requestOperation.Operation.FundReceivedDate = model.FondoRecibido ? model.FondoRecibidoFecha : requestOperation.Operation.FundReceivedDate;

            var result = await requestService.UpdateOperation(requestOperation.Operation, model.RequestId).ConfigureAwait(false);

            await CheckForAmlAlerts(model.RequestId).ConfigureAwait(false);

            if (result == null)
                AddCustomError("Se ha producido un error al modificar el importe");
            else
                AddCustomSuccess("Datos guardados correctamente: Es necesario regenerar la documentación");

            return RedirectToAction("Index", new { requestID = model.RequestId });
        }

        #region Test de cliente

        [HttpGet]
        public async Task<IActionResult> GetRDCode(string requestId, int rdCode)
        {
            bool result;
            try
            {
                Guid IdRequest = Guid.Parse(requestId);

                var request = await requestService.GetRequest(IdRequest).ConfigureAwait(false);
                request.IdCuenta = rdCode.ToString();
                await requestService.UpdateRequest(request).ConfigureAwait(false);
                var status = new RequestStatus
                {
                    IdRequest = IdRequest,
                    StartDate = DateTime.UtcNow,
                    Responsible = User.Identity.Name,
                    IdStatus = (int)RequestStatusEnum.Register
                };

                var statusList = new List<RequestStatus>
                {
                    status
                };

                result = await requestService.Add(statusList).ConfigureAwait(false) != null;

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

        [HttpGet]
        public async Task<ActionResult> GetApplicantTest(Guid requestId)
        {
            var tests = testService.GetTestAnswers(requestId);
            var requestApplicants = requestService.GetRequestApplicants(requestId);
            var request = await requestService.GetRequest(requestId).ConfigureAwait(false);

            await Task.WhenAll(tests, requestApplicants).ConfigureAwait(false);

            var testResult = tests.GetAwaiter().GetResult();
            var requestApplicantsResult = requestApplicants.GetAwaiter().GetResult().OrderBy(o => o.ApplicantRoleType.Id);

            var applicantTests = testResult.GroupBy(x => x.User.DNI).Select(x =>
            {
                var parent = testResult.Where(r => r.User.DNI == x.Key);
                var applicant = requestApplicantsResult.FirstOrDefault(ra => ra.Applicant.DNI == x.Key);

                var questionReplace = parent.FirstOrDefault(r => r.Question.Id == 280);

                if (questionReplace is not null)
                {


                    if (request.IsEmployee.Value)
                    {
                        questionReplace.Question.Text = questionReplace.Question.Text.Replace("{Value}", "6000");
                    }
                    else
                    {
                        questionReplace.Question.Text = questionReplace.Question.Text.Replace("{Value}", $"{request.Product.MinorMin.Value.ToString("N", new CultureInfo("es-ES"))}");
                    }
                }

                var questions = parent.GroupBy(cc => cc.Question.Id).Select(dd =>
                {
                    dd.First().Question.TestType = dd.First().Question.TestType == 7 ? 2 : dd.First().Question.TestType;
                    var r = new QuestionsViewModel
                    {
                        Question = dd.First().Question,
                        Answer = string.Join(dd.First().Question.Id == 51 ? ", " : " ", dd.Select(v =>
                        {
                            var answer = v.Answer.Text;
                            if (!string.IsNullOrEmpty(v.Answer.OtherAnswer))
                            {
                                var otherAnswer = answer.Substring(answer.Length - 1, 1) == ":" ? $" {v.Answer.OtherAnswer}" : $": {v.Answer.OtherAnswer}";
                                answer += otherAnswer;
                            }
                            return answer;
                        }).ToList()),
                        AllowEdit = (dd.First().Question.TestType == 1 || dd.First().Question.TestType == 4)
                    };
                    return r;
                }).OrderBy(o => o.Question.Id);

                if (parent.Any())
                {
                    return new ApplicantTestsViewModel
                    {
                        User = new User
                        {
                            DNI = parent.FirstOrDefault()?.User.DNI,
                            FirstSurname = parent.FirstOrDefault()?.User.FirstSurname,
                            Name = parent.FirstOrDefault()?.User.Name,
                            RDCode = applicant.Applicant.RdCode,
                            Role = parent.FirstOrDefault()?.User.Role,
                            SecondSurname = parent.FirstOrDefault()?.User.SecondSurname
                        },
                        Questions = new[] {
                            new QuestionsViewModel { Question=new BestInver.WebPrivada.Shared.Models.Microservices.Tests.TestQuestion{ Text="Fecha de nacimiento", TestType = (int)TestType.Knowledge }, Answer= applicant.Applicant.Birthday.HasValue ?  applicant.Applicant.Birthday.Value.ToString("dd/MM/yyyy") : ""  , AllowEdit = false},
                            new QuestionsViewModel { Question=new BestInver.WebPrivada.Shared.Models.Microservices.Tests.TestQuestion{ Text="Lugar de nacimiento", TestType =  (int)TestType.Knowledge }, Answer= !string.IsNullOrEmpty(applicant.Applicant.BornPlace) ? applicant.Applicant.BornPlace : "" , AllowEdit = false},
                            new QuestionsViewModel { Question=new BestInver.WebPrivada.Shared.Models.Microservices.Tests.TestQuestion{ Text="País nacimiento", TestType =  (int)TestType.Knowledge }, Answer= applicant.Applicant.Countries.Any(c=>c.CountryType.Id==(int)CountryType.Birth) ?   applicant.Applicant.Countries.FirstOrDefault(c=>c.CountryType.Id==(int)CountryType.Birth)?.Description : "" , AllowEdit = false },
                            new QuestionsViewModel { Question=new BestInver.WebPrivada.Shared.Models.Microservices.Tests.TestQuestion{ Text="Nacionalidad", TestType =  (int)TestType.Knowledge }, Answer= applicant.Applicant.Countries.Any(c=>c.CountryType.Id==(int)CountryType.Nationality) ? applicant.Applicant.Countries.FirstOrDefault(c=>c.CountryType.Id==(int)CountryType.Nationality)?.Description : "", AllowEdit = false },
                            new QuestionsViewModel { Question=new BestInver.WebPrivada.Shared.Models.Microservices.Tests.TestQuestion{ Id=39, Text="Segundo país de residencia", TestType =  (int)TestType.Knowledge }, Answer= applicant.Applicant.Countries.Any(c=>c.CountryType.Id==(int)CountryType.SecondaryResidence) ? applicant.Applicant.Countries.FirstOrDefault(c=>c.CountryType.Id==(int)CountryType.SecondaryResidence)?.Description : "", AllowEdit = (applicant.Applicant.ApplicantType.Id == (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.ApplicantType.Fisica)  },
                        }.Concat(questions)
                    };
                }
                return null;
            });

            var result = applicantTests?.OrderBy(o => o.User.Role.Id);

            return Json(result);
        }

        #endregion Test de cliente

        #region Bloqueos de solicitud

        [HttpPost]
        [Authorize(Policy = MiddleOfficeClaimNames.SolicitudModificacion)]
        public async Task<ActionResult> LockRequest(ManagementRequestModel model)
        {
            var result = await requestService.Lock(model.Id, User.Identity.Name).ConfigureAwait(false);
            AddCustomSuccess(result ? "Solicitud bloqueada con éxito" : "No se pudo bloquar la solicitud");

            return RedirectToAction("Index", new { requestID = model.Id });
        }

        [HttpPost]
        [Authorize(Policy = MiddleOfficeClaimNames.SolicitudModificacion)]
        public async Task<ActionResult> UnlockRequest(ManagementRequestModel model)
        {
            var result = await requestService.Unlock(model.Id, mapper.Map<UnlockModel>(model)).ConfigureAwait(false);
            AddCustomSuccess(result ? "Solicitud desbloqueada con éxito" : "No se pudo desbloquar la solicitud");

            return RedirectToAction("Index", new { requestID = model.Id });
        }

        [HttpPost]
        [Authorize(Roles = DefaultRoles.Admin)]
        public Task<ActionResult> AdminUnlockRequest(ManagementRequestModel model)
            => UnlockRequest(model);

        #endregion Bloqueos de solicitud

        #region Documentos

        private async Task<IEnumerable<RequestDocuments>> GetRequestDocuments(Guid requestId, Signer signer, IEnumerable<DocFile> files, IEnumerable<DocFile> signedFiles)
        {
            var documentsFromBD = await requestService.GetRequestDocuments(requestId, signer.Dni).ConfigureAwait(false);

            if (documentsFromBD is null)
            {
                documentsFromBD = [];
            }

            return documentsFromBD;
        }

        [HttpPost]
        public async Task<IActionResult> GetEcerticSignedStatus([FromBody] ManagementRequestModel managementRequestModel)
        {
            var request = managementRequestModel.Request;
            var singStatus = new SignedStatus { RequestId = request.Id.ToString(), SignerDNI = string.Empty };
            var result = new List<RequestDocumentsSignedModel>();
            bool isFCR = managementRequestModel.ProductOperations.Any(p => p.IdProduct == (int)ProductNames.BESTINVER_INFRA);

            SignedRequestStatus documentsFromEcertic = null;

            try
            {
                documentsFromEcertic = await signaturesService.GetDocumentSignedStatus(singStatus).ConfigureAwait(false);
            }
            catch (Exception)
            {
                documentsFromEcertic = null;
            }

            if (documentsFromEcertic != null && documentsFromEcertic?.DocFiles != null && documentsFromEcertic.DocSignedFiles != null
                && (documentsFromEcertic.DocFiles.Count > 0 || documentsFromEcertic.DocSignedFiles.Count > 0))
            {
                int indexSigner = 0;
                foreach (var list in documentsFromEcertic.DocFiles)
                {
                    var minutes = appSettings.Value.ReplaySignatureLife;

                    var signedDocuments = new RequestDocumentsSignedModel();
                    var signer = documentsFromEcertic.Signers[indexSigner];
                    var dni = documentsFromEcertic.IdData[indexSigner];
                    var token = documentsFromEcertic.Tokens[indexSigner];

                    var applicant = managementRequestModel.Applicants.Find(a => a.Applicant.BasicData.DNI == signer.Dni);
                    var replayDate = applicant.ReplaySignatureDate.GetValueOrDefault();
                    bool allowReplay = replayDate == default || replayDate.AddMinutes(minutes) <= DateTime.UtcNow;

                    var documentsFromBD = await GetRequestDocuments(request.Id, signer, documentsFromEcertic.DocFiles[indexSigner], documentsFromEcertic.DocSignedFiles[indexSigner]).ConfigureAwait(false);

                    signedDocuments.Signer = signer?.Name;
                    signedDocuments.SignedStatus = documentsFromEcertic.SignersStatus[indexSigner];
                    signedDocuments.AllowRecoverySignature =
                        allowReplay
                        && request.IdSendingWay != (int)SendingWayType.EnviarCorreoPostal
                        && !string.IsNullOrEmpty(signer.Phone)
                        && signedDocuments.SignedStatus != "SIGNED"
                        && signedDocuments.SignedStatus != "OTP_OK"
                        && !isFCR;

                    signedDocuments.SignerDNI = signer.Dni;
                    signedDocuments.OtherDocuments = GetPublicUrlDownloadDocument(dni.OtrosDocumentos, appSettings.Value.Aes256Key);
                    signedDocuments.SignerBirthday = applicant.Applicant.PersonalData.Birthday?.ToString("yyyy-MM-dd");
                    signedDocuments.SignerIsMinor = applicant.Applicant.PersonalData.Birthday.IsMinor();
                    int role = 0;
                    signedDocuments.SignerRole = role;

                    if (dni != null)
                    {
                        signedDocuments.DNI = new DNIDataModel
                        {
                            AnversoDNI = GetPublicUrlDownloadDocument(dni.AnversoDni, appSettings.Value.Aes256Key),
                            ReversoDNI = GetPublicUrlDownloadDocument(dni.ReversoDni, appSettings.Value.Aes256Key)
                        };
                    }

                    var status = managementRequestModel.Status.Where(x => x.IDRequest == request.Id).OrderByDescending(rs => rs.StartDate).FirstOrDefault();

                    signedDocuments.AllowSendDniData =
                        status.IDStatus == (int)RequestStatusEnum.PendingDNI
                        && string.IsNullOrEmpty(dni.AnversoDni)
                        && request.IdSendingWay != null
                        && request.IdSendingWay != (int)SendingWayType.EnviarCorreoPostal;

                    signedDocuments.AllowSendLibroFamilia =
                        applicant.Applicant.PersonalData.Birthday.HasValue
                        && applicant.Applicant.PersonalData.Birthday.IsMinor()
                        && request.IdSendingWay != (int)SendingWayType.EnviarCorreoPostal;

                    //PRJ-3641 Se comenta este filtro para que aparezcan también los .png o .jpg cuando subes un CIF/Poder/Escritura como imagen en una Jurídica.
                    //var filteredDocsFromBd = documentsFromBD.Where(d => d.DocumentName.Contains(".pdf"));

                    documentsFromBD.ToList().ForEach(signedDoc =>
                    {
                        if (signedDoc != null)
                        {
                            var availableDownloadDoc = true;
                            var availableDownloadDocFirmado = true;

                            if (applicant.ElectronicSignatureServiceVersion != 2 && applicant.ElectronicSignatureServiceVersion != 3)
                            {
                                if (signedDoc.DocumentUrl != null &&
                                    (signedDoc.DocumentUrl.Contains("bestinver.kimak", StringComparison.OrdinalIgnoreCase) ||
                                    signedDoc.DocumentUrl.Contains("api.otpsecure", StringComparison.OrdinalIgnoreCase)))
                                {
                                    availableDownloadDoc = false;
                                }

                                if (signedDoc.DocumentUrlFirmado != null &&
                                    (signedDoc.DocumentUrlFirmado.Contains("bestinver.kimak", StringComparison.OrdinalIgnoreCase) ||
                                    signedDoc.DocumentUrlFirmado.Contains("api.otpsecure", StringComparison.OrdinalIgnoreCase)))
                                {
                                    availableDownloadDocFirmado = false;
                                }
                            }

                            var item = new RequestDocumentModel
                            {
                                AvailableDownloadDoc = availableDownloadDoc,
                                AvailableDownloadDocFirmado = availableDownloadDocFirmado,
                                DocumentName = signedDoc.DocumentName,
                                DocumentUrl = String.IsNullOrEmpty(signedDoc.DocumentUrl) ? string.Empty : GetPublicUrlDownloadDocument(signedDoc.DocumentUrl, appSettings.Value.Aes256Key),
                                DocumentUrlFirmado = String.IsNullOrEmpty(signedDoc.DocumentUrlFirmado) ? string.Empty : GetPublicUrlDownloadDocument(signedDoc.DocumentUrlFirmado, appSettings.Value.Aes256Key),
                                Firmado = !String.IsNullOrEmpty(signedDoc.DocumentUrlFirmado),
                                IDRequest = request.Id,
                                Recibido = signedDoc.Recibido ?? false,
                                Valido = signedDoc.Valido ?? false,
                                Participe = signer?.Name,
                                ParticipeDNI = signer?.Dni,
                                TipoFirma = request.IdRequestSignature ?? 0,
                                Id = signedDoc.Id
                            };

                            if (DateTime.TryParse(signedDoc.FechaFirma, out DateTime fechaFirma))
                            {
                                item.FechaFirma = fechaFirma;
                            }

                            signedDocuments.Documents.Add(item);
                        }
                    });

                    result.Add(signedDocuments);
                    indexSigner++;
                }
                if (managementRequestModel.Data.BasicData.ApplicantType == (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.ApplicantType.Juridica)
                {
                    result.Insert(0, new RequestDocumentsSignedModel
                    {
                        Signer = $"{managementRequestModel.Data.BasicData.Name} (Organización)",
                        AllowSendPoderes = true,
                        AllowSendEscrituras = true,
                        SignerDNI = managementRequestModel.Data.BasicData.DNI,
                        AllowRecoverySignature = false,
                        AllowSendDniData = false,
                        AllowSendLibroFamilia = false
                    });
                }
            }

            if (result.Count == 0)
            {
                bool allowRecoverySig = request.IdSendingWay != (int)SendingWayType.EnviarCorreoPostal && request.IdSendingWay != null && !isFCR;
                result.AddRange(managementRequestModel.Applicants.Select(appRole => new RequestDocumentsSignedModel
                {
                    AllowRecoverySignature = allowRecoverySig,
                    AllowSendDniData = !(appRole.Applicant.BasicData.ApplicantType == (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.ApplicantType.Juridica),
                    AllowSendEscrituras = appRole.Applicant.BasicData.ApplicantType == (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.ApplicantType.Juridica,
                    AllowSendPoderes = appRole.Applicant.BasicData.ApplicantType == (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.ApplicantType.Juridica,
                    AllowSendLibroFamilia = false,
                    Documents = new List<RequestDocumentModel>(),
                    OtherDocuments = new List<object>(),
                    Signer = appRole.Applicant.BasicData.ApplicantType == (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.ApplicantType.Juridica ? $"{appRole.Applicant.BasicData.Name} (Organización)" : appRole.Applicant.BasicData.CompleteName,
                    SignerDNI = appRole.Applicant.BasicData.DNI,
                    SignerBirthday = (appRole.Applicant.BasicData.ApplicantType == (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.ApplicantType.Juridica || !appRole.Applicant.PersonalData.Birthday.HasValue) ? null : appRole.Applicant.PersonalData.Birthday.Value.ToString("yyyy-MM-dd")
                }));
            }

            return Json(new
            {
                data = result.OrderBy(o => o.SignerRole).Select(d => new
                {
                    d.DNI,
                    Documents = d.Documents.Select(s => new
                    {
                        s.AvailableDownloadDoc,
                        s.AvailableDownloadDocFirmado,
                        s.DocumentName,
                        s.DocumentUrl,
                        s.DocumentUrlFirmado,
                        FechaFirma = DateTime.SpecifyKind(s.FechaFirma, DateTimeKind.Utc).ToString("O"),
                        s.Firmado,
                        s.IDRequest,
                        s.Participe,
                        s.ParticipeDNI,
                        s.Recibido,
                        s.TipoFirma,
                        s.Valido,
                        s.Id
                    }),
                    d.SignedStatus,
                    d.Signer,
                    d.SignerDNI,
                    d.SignerRole,
                    d.SignerBirthday,
                    d.SignerIsMinor,
                    d.AllowRecoverySignature,
                    d.AllowSendDniData,
                    d.AllowSendLibroFamilia,
                    d.AllowSendPoderes,
                    d.AllowSendEscrituras,
                    d.OtherDocuments
                })
            });
        }

        [HttpPost]
        public async Task<IActionResult> SaveDniData([FromBody] DNIData model)
        {
            bool result = false;

            if (model.AltaJuridica)
            {
                model.moveStatus = false;
                await registerService.SaveJuridicDocuments(model).ConfigureAwait(false);
                result = true;
            }
            else
            {
                model.moveStatus = true;
                await registerService.SaveDni(model).ConfigureAwait(false);
                result = true;
            }

            return Json(new
            {
                result
            });
        }

        [HttpGet]
        public async Task<IActionResult> SendDniremainderMail(Guid requestId, string dni)
        {
            var result = true;
            await sendMailService.SendDniremainderMail(requestId, dni).ConfigureAwait(false);

            return Json(new
            {
                result
            });
        }

        [HttpPost]
        public async Task<IActionResult> GenerateJuridicDocumentation(DocumentGroupData model)
        {
            Guid id = model.RequestId;
            try
            {
                var uniqueMobileResult = await requestService.ValidateUniqueMobile(model.RequestId).ConfigureAwait(false);
                var uniqueSameResult = await requestService.ValidateSameMobile(model.RequestId).ConfigureAwait(false);

                if (!uniqueMobileResult || !uniqueSameResult) throw new UniqueMobileException();

                var documentGroup = new RequestDocumentGroup
                {
                    DocumentSignatureTypeId = (int)model.IdDocumentSignatureType,
                    SendingWayId = (int)model.IdSendingWay
                };

                if (model.DocAction == GenerateDocAction.Regenerar)
                {
                    var originalRequest = await requestService.GetRequest(model.RequestId).ConfigureAwait(false);
                    if (originalRequest.Alerts.Any(a => a.IdAria != null && a.EndDate == null))
                    {
                        AddCustomError("No se ha podido regenerar la documentación porque tienes alertas de Aria o IdConfirma sin resolver.");
                    }
                    else
                    {
                        var clonedrequest = await requestService.CloneRequest(model.RequestId).ConfigureAwait(false);

                        var status = new RequestStatus
                        {
                            IdRequest = model.RequestId,
                            Comments = "Se ha regenerado la documentación de esta solicitud",
                            StartDate = DateTime.UtcNow,
                            Responsible = "Sistema",
                            IdStatus = (int)RequestStatusEnum.Canceled
                        };
                        var statusList = new List<RequestStatus> { status };
                        await requestService.Add(statusList).ConfigureAwait(false);

                        id = new Guid(clonedrequest);
                        await registerService.GenerateJuridicDoc(documentGroup, id).ConfigureAwait(false);
                        AddCustomSuccess("Documentación generada correctamente");
                    }

                }
                else
                {
                    //HACK: aplicamos un cambio para evitar que se pierdan enl anverso y revierso de los clientes
                    //cuando generas la documentación juridica por primera vez. Esto ha de mejorarse
                    var docs = await requestService.GetRequestDocuments(model.RequestId, null);

                    await registerService.GenerateJuridicDoc(documentGroup, model.RequestId).ConfigureAwait(false);

                    foreach (var doc in docs) //Limpiamos los Ids para forzar a que se creen nuevos registros 
                    {
                        doc.Id = 0;
                    }
                    await requestService.InsertRequestDocument(docs.Where(doc =>
                        doc.DocumentName.StartsWith("Anverso.", StringComparison.OrdinalIgnoreCase) ||
                        doc.DocumentName.StartsWith("Reverso.", StringComparison.OrdinalIgnoreCase)));

                    AddCustomSuccess("Documentación generada correctamente");
                }


            }
            catch (UniqueMobileException)
            {
                var statusList = new List<RequestStatus>
                {
                    new RequestStatus
                    {
                        IdRequest = model.RequestId,
                        IdStatus = (int)RequestStatusEnum.Locked,
                        StartDate = DateTime.UtcNow,
                        Comments = "",
                        Responsible = "sistema"
                    }
                };
                await requestService.Add(statusList).ConfigureAwait(false);
                AddCustomError("Se ha producido un error al generar la documentación debido a la validación de los teléfonos móviles de los partícipes");
            }
            catch
            {
                AddCustomError("Se ha producido un error al generar la documentación");
            }

            return RedirectToAction("Index", new { requestID = id });
        }

        [HttpPost]
        public async Task<IActionResult> UploadDocumentToSFTP(string requestID)
        {
            var result = true;
            await signaturesService.SendDocumentsPostalDelivery(new Guid(requestID)).ConfigureAwait(false);
            return Json(new
            {
                result = result
            });
        }

        [HttpPost]
        public async Task<IActionResult> ChangeDocValidStatus(int docId, bool status, Guid requestId, string dni)
        {
            try
            {
                var documentRequest = await requestService.GetRequestDocuments(requestId, dni).ConfigureAwait(false);
                var doc = documentRequest.FirstOrDefault(d => d.Id == docId);
                doc.Valido = status;
                await requestService.UpdateRequestDocument(doc).ConfigureAwait(false);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<IActionResult> ChangeDocReceivedStatus(int docId, bool status, Guid requestId, string dni)
        {
            try
            {
                var documentRequest = await requestService.GetRequestDocuments(requestId, dni).ConfigureAwait(false);
                var doc = documentRequest.FirstOrDefault(d => d.Id == docId);
                doc.Recibido = status;
                await requestService.UpdateRequestDocument(doc).ConfigureAwait(false);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        #endregion Documentos

        #region Alertas

        [HttpGet]
        public PartialViewResult GetAlerts(Guid requestId)
        {
            var alerts = alertService.Search(new RequestAlertMOSearch
            {
                IdRequest = requestId
            }).GetAwaiter().GetResult();

            var model = mapper.Map<List<RequestAlertModel>>(alerts);
            return PartialView("_AlertsListView", model);
        }

        [HttpGet("{requestId}")]
        [Authorize(MiddleOfficeClaimNames.GestionAlertasModificacion)]
        public async Task<IActionResult> CreateAlertModal([FromRoute] CreateAlertModel model)
        {
            var alertTypes = await alertService.GetAllAlertTypes().ConfigureAwait(false);
            model.AlertTypes = new SelectList(mapper.Map<List<SelectItemModel>>(alertTypes), nameof(SelectItemModel.Id), nameof(SelectItemModel.Description));
            return PartialView("_CreateAlertModalView", model);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        [Authorize(MiddleOfficeClaimNames.GestionAlertasModificacion)]
        public async Task<IActionResult> CreateAlert([FromForm] CreateAlertModel model)
        {
            if (!ModelState.IsValid)
            {
                return PartialView("_CreateAlertModalView", model);
            }

            try
            {
                model.StartDate = DateTime.UtcNow;
                model.Details = $"{model.Details} | Creada por: {User.Identity.Name}";
                var alert = mapper.Map<Alert>(model);
                alert.Id = null;
                await registerService.CreateAlert(alert).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                ModelState.AddModelError("ErrorMessage", stringLocalizer[ResourceKeys.ErrorMessages.AnError]);
                return PartialView("_CreateAlertModalView", model);
            }
            return Ok(true);
        }

        [HttpPost]
        [Authorize(MiddleOfficeClaimNames.GestionAlertasModificacion)]
        public IActionResult ResolveAlertModal([FromBody] ResolveAlertModel model)
        {
            model.Responsbile = User.Identity.Name;
            model.StartDate = DateTime.SpecifyKind(model.StartDate.Value, DateTimeKind.Utc);
            return PartialView("_ResolveAlertModalView", model);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        [Authorize(Policy = MiddleOfficeClaimNames.GestionAlertasModificacion)]
        public async Task<ActionResult> ResolveAlert([FromForm] ResolveAlertModel model)
        {
            model.Responsbile = User.Identity.Name;
            model.EndDate = DateTime.UtcNow;

            foreach (var entry in ModelState.Where(x => x.Value?.Errors.Count > 0))
            {
                logger.LogWarning("ModelState inválido. Campo: {Field}. Errores: {Errors}",
                    entry.Key,
                    string.Join(" | ", entry.Value!.Errors.Select(e => e.ErrorMessage)));
            }

            if (!ModelState.IsValid)
            {
                return PartialView("_ResolveAlertModalView", model);
            }

            try
            {
                var alert = mapper.Map<Alert>(model);
                await registerService.SolveAlert(alert).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                ModelState.AddModelError("ErrorMessage", stringLocalizer[ResourceKeys.ErrorMessages.AnError]);
                return PartialView("_ResolveAlertModalView", model);
            }

            return Json(new
            {
                alert = model,
                result = true
            });
        }

        #endregion Alertas

        #region Estados de solicitud

        [HttpPost]
        [Authorize(MiddleOfficeClaimNames.EstadosModificacion)]
        public async Task<IActionResult> MoveToAbandoned([FromBody] ChangeRequestStatusModel model)
        {
            var result = false;
            if (ModelState.IsValid)
            {
                var status = new RequestStatus
                {
                    IdRequest = model.RequestId,
                    Comments = model.Comments,
                    StartDate = DateTime.UtcNow,
                    Responsible = User.Identity.Name,
                    IdStatus = (int)RequestStatusEnum.Abandoned
                };

                var statusList = new List<RequestStatus>
                {
                    status
                };

                result = await requestService.Add(statusList).ConfigureAwait(false) != null;
            }

            return Json(new
            {
                result
            });
        }

        [HttpPost]
        [Authorize(MiddleOfficeClaimNames.EstadosModificacion)]
        public async Task<IActionResult> MoveToExpired([FromBody] ChangeRequestStatusModel model)
        {
            var result = false;
            if (ModelState.IsValid)
            {
                var status = new RequestStatus
                {
                    IdRequest = model.RequestId,
                    Comments = model.Comments,
                    StartDate = DateTime.UtcNow,
                    Responsible = User.Identity.Name,
                    IdStatus = (int)RequestStatusEnum.Expired
                };

                var statusList = new List<RequestStatus>
                {
                    status
                };

                result = await requestService.Add(statusList).ConfigureAwait(false) != null;
            }

            return Json(new
            {
                result
            });
        }

        [HttpPost]
        [Authorize(MiddleOfficeClaimNames.EstadosModificacion)]
        public async Task<IActionResult> MoveToCanceled([FromBody] ChangeRequestStatusModel model)
        {
            var result = false;
            if (ModelState.IsValid)
            {
                var status = new RequestStatus
                {
                    IdRequest = model.RequestId,
                    Comments = model.Comments,
                    StartDate = DateTime.UtcNow,
                    Responsible = User.Identity.Name,
                    IdStatus = (int)RequestStatusEnum.Canceled
                };

                var statusList = new List<RequestStatus>
                {
                    status
                };

                result = await requestService.Add(statusList).ConfigureAwait(false) != null;
                await amlService.Cancel(model.RequestId).ConfigureAwait(false);
            }

            return Json(new
            {
                result
            });
        }

        [HttpPost]
        [Authorize(MiddleOfficeClaimNames.EstadosModificacion)]
        public async Task<IActionResult> MoveToAdendas([FromBody] ChangeRequestStatusModel model)
        {
            var result = false;
            if (ModelState.IsValid)
            {
                var status = new RequestStatus
                {
                    IdRequest = model.RequestId,
                    Comments = model.Comments,
                    StartDate = DateTime.UtcNow,
                    Responsible = User.Identity.Name,
                    IdStatus = (int)RequestStatusEnum.Adendas
                };
                var statusList = new List<RequestStatus>
                {
                    status
                };
                result = await requestService.Add(statusList).ConfigureAwait(false) != null;
                await amlService.Cancel(model.RequestId).ConfigureAwait(false);
            }
            return Json(new
            {
                result
            });
        }

        [HttpPost]
        [Authorize(MiddleOfficeClaimNames.EstadosModificacion)]
        public async Task<IActionResult> ChangeRequestStatus([FromBody] ChangeRequestStatusModel model)
        {
            var result = false;
            var showPendingSignaturePopUp = false;

            try
            {
                if (ModelState.IsValid)
                {
                    model.Responsible = User.Identity.Name;
                    model.FromManagement = true;
                    var changeRequestResponse = await registerService.ChangeRequestStatus(model).ConfigureAwait(false);
                    result = changeRequestResponse.StatusList != null && changeRequestResponse.StatusList.Any();
                    showPendingSignaturePopUp = changeRequestResponse.ShowPendingSignaturePopUp;

                    if (result == true && changeRequestResponse.StatusList.LastOrDefault() != null && changeRequestResponse.StatusList.LastOrDefault().IdStatus == (int)RequestStatusEnum.Representatives_Sign)
                    {
                        await SendToMailteckIfDigital(model.RequestId);
                    }
                }
            }
            catch
            {
                result = false;
                return Json(new
                {
                    result
                });
            }

            return Json(new
            {
                result,
                showPendingSignaturePopUp
            });
        }

        private async Task SendToMailteckIfDigital(Guid requestId)
        {
            await registerService.SendToMailteckIfDigital(requestId).ConfigureAwait(false);
        }

        /// <summary>
        /// Send the request to Operations
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(MiddleOfficeClaimNames.EstadosModificacion)]
        public async Task<IActionResult> SendToRD([FromBody] ChangeRequestStatusModel model)
        {
            var result = false;

            try
            {
                if (ModelState.IsValid)
                {

                    logger.LogWarning("llamando al microservicio request con la requestid {RequestId} para pasarla al estado Enviado a Operaciones por parte de {User}", model.RequestId, User.Identity.Name);
                    var status = new RequestStatus
                    {
                        IdRequest = model.RequestId,
                        Comments = "Enviado a Operaciones",
                        StartDate = DateTime.UtcNow,
                        Responsible = User.Identity.Name,
                        IdStatus = (int)RequestStatusEnum.SentToOperations
                    };

                    var statusList = new List<RequestStatus>{
                        status
                    };

                    var responseStatus = await requestService.Add(statusList).ConfigureAwait(false);
                    logger.LogWarning("llamando al microservicio request con la requestid {RequestId} para pasarla al estado Enviado a Operaciones por parte de {User}. Estos elementos {NumberOfElements}", model.RequestId, User.Identity.Name, statusList != null ? statusList.Count : 0);

                    result = responseStatus.FirstOrDefault()?.IdStatus == (int)RequestStatusEnum.SentToOperations;
                    //ahora logeamos el json del firstordefault para tener más información en caso de que falle el test de enviar a operaciones
                    logger.LogWarning("FirstOrDefault {Response}", responseStatus.FirstOrDefault() != null ? System.Text.Json.JsonSerializer.Serialize(responseStatus.FirstOrDefault()) : "null");

                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error al enviar la solicitud con id {RequestId} a operaciones", model.RequestId);
                result = false;
                return Json(new
                {
                    result
                });
            }

            return Json(new
            {
                result
            });
        }

        [HttpPost]
        [Authorize(MiddleOfficeClaimNames.EstadosModificacion)]
        public async Task<IActionResult> SendToRDWithCompromise([FromBody] ChangeRequestStatusModel model)
        {
            var result = false;

            try
            {
                if (ModelState.IsValid)
                {
                    var optionsDate = new Dictionary<string, string>();
                    foreach (var optionDate in model.OperationsDate)
                    {
                        optionsDate.Add(optionDate.Key.ToString(), optionDate.Value.ToString());
                    }
                    var compromise = new CompromiseParameter { IdCompromise = model.CompromiseId, OperationsDate = optionsDate };

                    var rdResult = await singupService.SendToRDWithCompromise(model.RequestId, compromise).ConfigureAwait(false);

                    if (rdResult.Result)
                    {

                        //RequestStatus ahora siempre utiliza la versión de Alter
                        var status = new RequestStatus
                        {
                            IdRequest = model.RequestId,
                            Comments = "Enviado a Operaciones",
                            StartDate = DateTime.UtcNow,
                            Responsible = User.Identity.Name,
                            IdStatus = (int)RequestStatusEnum.SentToOperations
                        };

                        var statusList = new List<RequestStatus>{
                            status
                        };

                        result = await requestService.Add(statusList).ConfigureAwait(false) != null;

                        var request = await requestService.GetRequest(model.RequestId).ConfigureAwait(false);
                        request.IdCuenta = rdResult.CuentaId;
                        result = result && await requestService.UpdateRequest(request).ConfigureAwait(false) != null;
                    }
                }
            }
            catch
            {
                result = false;
                return Json(new
                {
                    result
                });
            }

            return Json(new
            {
                result
            });
        }

        [HttpPost]
        [Authorize(MiddleOfficeClaimNames.EstadosModificacion)]
        public async Task<IActionResult> SendToRDSubscriptionWithCompromise([FromBody] ChangeRequestStatusModel model)
        {
            var result = false;

            try
            {
                if (ModelState.IsValid)
                {
                    var optionsDate = new Dictionary<string, string>();
                    foreach (var optionDate in model.OperationsDate)
                    {
                        optionsDate.Add(optionDate.Key.ToString(), optionDate.Value.ToString());
                    }
                    var compromise = new CompromiseParameter { IdCompromise = model.CompromiseId, OperationsDate = optionsDate };

                    var rdResult = await singupService.SendToRDSubscriptionWithCompromise(model.RequestId, compromise).ConfigureAwait(false);

                    if (rdResult.Result)
                    {
                        var status = new RequestStatus
                        {
                            IdRequest = model.RequestId,
                            Comments = "Enviado a Operaciones",
                            StartDate = DateTime.UtcNow,
                            Responsible = User.Identity.Name,
                            IdStatus = (int)RequestStatusEnum.SentToOperations
                        };


                        var statusList = new List<RequestStatus>{
                            status
                        };

                        result = await requestService.Add(statusList).ConfigureAwait(false) != null;

                        var request = await requestService.GetRequest(model.RequestId).ConfigureAwait(false);
                        request.IdCuenta = rdResult.CuentaId;
                        result = result && await requestService.UpdateRequest(request).ConfigureAwait(false) != null;
                    }
                }
            }
            catch
            {
                result = false;
                return Json(new
                {
                    result
                });
            }

            return Json(new
            {
                result
            });
        }

        [HttpPost]
        [Authorize(MiddleOfficeClaimNames.EstadosModificacion)]
        // [ValidateAntiForgeryToken]
        public async Task<IActionResult> CancelRequest([Bind(new string[] {
            nameof(ChangeRequestStatusModel.RequestId),
            nameof(ChangeRequestStatusModel.Comments)}),FromForm]ChangeRequestStatusModel model)
        {
            var result = false;
            if (ModelState.IsValid)
            {
                var status = new RequestStatus
                {
                    IdRequest = model.RequestId,
                    Comments = model.Comments,
                    StartDate = DateTime.UtcNow,
                    Responsible = User.Identity.Name,
                    IdStatus = (int)RequestStatusEnum.Canceled
                };

                var statusList = new List<RequestStatus>
                {
                    status
                };

                result = await requestService.Add(statusList).ConfigureAwait(false) != null;
                //TODO: ¿Añadir alerta si hay error con Aria? --Servicio
                await amlService.Cancel(model.RequestId).ConfigureAwait(false);
            }

            return Json(new
            {
                result
            });
        }

        [HttpGet("{requestId}")]
        [Authorize(MiddleOfficeClaimNames.EstadosModificacion)]
        public IActionResult CancelRequestModal([FromRoute] CancelRequestModel model)
        {
            return PartialView("_CancelRequest", model);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        [Authorize(MiddleOfficeClaimNames.EstadosModificacion)]
        public IActionResult CancelRequestValidation([FromForm] CancelRequestModel model)
        {
            if (ModelState.IsValid)
            {
                model.Comments = string.IsNullOrWhiteSpace(model.OtherComments) ? model.Comments : model.OtherComments;
                return RedirectToActionPreserveMethod("CancelRequest", "Details", model);
            }
            return PartialView("_CancelRequest", model);
        }

        [HttpGet]
        public async Task<IActionResult> ReplaySignature(Guid requestId, string dni)
        {
            var result = true;
            await signaturesService.ReplaySignature(requestId, dni, false).ConfigureAwait(false);


            var request = await requestService.GetRequest(requestId);
            var requestApplicant = request.Applicants.FirstOrDefault(a => a.Applicant.DNI.Equals(dni, StringComparison.InvariantCultureIgnoreCase));
            bool hasToSign = requestApplicant.Applicant.ApplicantType.Id != (int)PersonTypeEnum.Juridica && (requestApplicant.ApplicantRoleType.Id != (int)ApplicantRoleType.Beneficiario && requestApplicant.Applicant.Birthday.HasValue && !requestApplicant.Applicant.Birthday.IsMinor());
            requestApplicant.HasToSign = hasToSign;
            requestApplicant.ReplaySignatureDate = DateTime.UtcNow;

            request.RequestDocumentGroup.DocumentSignatureTypeId = (int)DocumentSignatureType.Digital;
            request.RequestDocumentGroup.SendingWayId = (int)SendingWayType.FirmaOnline;

            if (requestApplicant.SignerMail != requestApplicant.Applicant.Email)
            {
                requestApplicant.SignerMail = requestApplicant.Applicant.Email;
            }

            await requestService.UpdateApplicantRole(requestApplicant, requestId).ConfigureAwait(false);
            await requestService.UpdateRequest(request).ConfigureAwait(false);

            return Json(new
            {
                result
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetZipDocuments(Guid requestId, string dni)
        {
            var result = await signaturesService.GetZipDocuments(requestId).ConfigureAwait(false);
            var url = result.Zips.FirstOrDefault(z => z.Value.Contains(dni)).Value;
            url = GetPublicUrlDownloadDocument(url, appSettings.Value.Aes256Key);
            return Json(new
            {
                url
            });
        }

        public async Task<IActionResult> SendApplicantsToRD([FromBody] ChangeRequestStatusModel model)
        {
            bool result = true;
            try
            {
                var account = await signUpService.SendApplicantsToRD(model.RequestId).ConfigureAwait(false);

                if (!string.IsNullOrEmpty(account.CuentaId))
                {
                    var request = await requestService.GetRequest(model.RequestId).ConfigureAwait(false);
                    request.IdCuenta = account.CuentaId;
                    //¿porque se formatea el IBAN aqui?, todo parece indicar que debería hacerse en el servicio de registro cuando se guarda la request completa                    
                    if (!string.IsNullOrEmpty(request.AccountNumber))
                    {
                        request.AccountNumber = Regex.Replace(request.AccountNumber, "[^a-zA-Z0-9_.]+", "", RegexOptions.Compiled);
                        request.AccountNumber = String.Concat(request.AccountNumber.Where(c => !Char.IsWhiteSpace(c)));
                    }
                    await requestService.UpdateRequest(request).ConfigureAwait(false);

                    var status = new RequestStatus
                    {
                        IdRequest = model.RequestId,
                        Comments = "Enviado a Operaciones",
                        StartDate = DateTime.UtcNow,
                        Responsible = User.Identity.Name,
                        IdStatus = (int)RequestStatusEnum.SentToOperations
                    };

                    var statusList = new List<RequestStatus>
                    {
                        status
                    };

                    await requestService.Add(statusList).ConfigureAwait(false);
                }
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

        public async Task<IActionResult> SendOperationsToRD([FromBody] ChangeRequestStatusModel model)
        {
            bool result = true;
            try
            {
                var account = await signUpService.SendOperationsToRD(model.RequestId, model.RDIdCuenta, model.OperationsDate).ConfigureAwait(false);

                List<Task> tasks = [];
                foreach (var open in account.OperationsParOpe)
                {
                    var operation = await requestService.GetRequestOperation(open.Key).ConfigureAwait(false);
                    operation.Operation.ParOpe = open.Value.ToString();

                    tasks.Add(requestService.UpdateOperation(operation.Operation, model.RequestId));
                }

                await Task.WhenAll(tasks).ConfigureAwait(false);
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

        #endregion Estados de solicitud

        #region Cotitulares

        [HttpPost("{idCotitular}")]
        public IActionResult GetCotitularDetails([FromRoute] string idCotitular, [FromBody] ManagementRequestModel managementRequestModel)
        {
            var cotitular = managementRequestModel.Cotitulares.Single(x => x.NIF == idCotitular);
            var cotitularData = managementRequestModel.Applicants.Single(x => x.Applicant.BasicData.DNI == idCotitular);

            var model = mapper.Map<CotitularDataModel>(cotitularData);

            model.Countries = managementRequestModel.Countries;
            model.Nationalities = managementRequestModel.Nationalities;
            model.ViaTypes = managementRequestModel.ViaTypes;
            model.Genders = managementRequestModel.Genders;
            model.PostalAddress = cotitularData.Applicant.ContactData.SingleOrDefault(x => x.AddressType == nameof(Applicant.PostalAddress));
            model.FiscalAddress = cotitularData.Applicant.ContactData.SingleOrDefault(x => x.AddressType == nameof(Applicant.FiscalAddress));
            model.DifferentPostalAddress = model.PostalAddress.Id != model.FiscalAddress.Id;
            model.RequestId = managementRequestModel.Request.Id;
            model.LockedIsLocked = managementRequestModel.LockedIsLocked;
            model.LockedStartDate = managementRequestModel.LockedStartDate;
            model.LockedUserEmail = managementRequestModel.LockedUserEmail;
            model.LockedUserName = managementRequestModel.LockedUserName;
            model.RdClientCode = cotitular.RdCode;
            model.ShowOperationChange = managementRequestModel.ShowOperationChange;

            var requestStatus = managementRequestModel.Status?.LastOrDefault()?.IDStatus;
            model.DisabledSaveButton = (requestStatus == (int)RequestStatusEnum.Prospect || requestStatus == (int)RequestStatusEnum.PendingSignature || requestStatus == (int)RequestStatusEnum.Locked) ? "" : "disabled";

            if (model.Birthday.IsMinor())
            {
                model.InvalidPhones = "";
            }
            else
            {
                List<string> mobiles = [];
                managementRequestModel.Applicants.Where(a => a.Applicant.BasicData.DNI != model.DNI).ToList().ForEach(ap =>
                {
                    if (!ap.Applicant.PersonalData.Birthday.IsMinor())
                    {
                        var mobile = string.IsNullOrEmpty(ap.Applicant.BasicData.MobilePhoneNumber) ? "" : ap.Applicant.BasicData.MobilePhoneNumber;
                        if (mobile.StartsWith("+34"))
                        {
                            mobile = mobile.Replace("+34", "");
                        }
                        mobiles.Add(mobile);
                    }
                });
                model.InvalidPhones = string.Join(';', mobiles.ToArray());
            }

            return PartialView("_CotitularesDetailsView", model);
        }

        [HttpGet("{RequestId}")]
        [Authorize(MiddleOfficeClaimNames.GestionAlertasModificacion)]
        public async Task<IActionResult> ApproveApplicantModal([FromRoute] ApproveCotitularModel model)
        {
            var alerts = await alertService.Search(new RequestAlertMOSearch
            {
                IdRequest = model.RequestId
            }).ConfigureAwait(false);

            var juridicModel = alerts.Items.FirstOrDefault(a => a.AlertType.Id == (int)AlertTypes.AlertaPendienteValidarJuridico);

            model = mapper.Map<ApproveCotitularModel>(juridicModel);

            return PartialView("_CotitularesApproveModalView", model);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        [Authorize(Policy = MiddleOfficeClaimNames.GestionAlertasModificacion)]
        public async Task<ActionResult> ApproveApplicant([FromForm] ApproveCotitularModel model)
        {
            bool result = true;
            model.Responsbile = User.Identity.Name;
            model.EndDate = DateTime.Now;
            if (!ModelState.IsValid)
            {
                return PartialView("_CotitularesApproveModalView", model);
            }

            try
            {
                var alert = mapper.Map<Alert>(model);
                await registerService.SolveAlert(alert).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "{Message}", ex.Message);
                ModelState.AddModelError("ErrorMessage", stringLocalizer[ResourceKeys.ErrorMessages.AnError]);
                return PartialView("_ResolveAlertModalView", model);
            }

            return Json(new
            {
                result
            });
        }

        [HttpPost]
        //  [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateTitularData([FromForm] TitularDataModel model)
        {
            try
            {
                List<Task> tasks = new List<Task>();
                var applicant = await applicantService.GetApplicantByDNI(model.DNI).ConfigureAwait(false);
                applicant.BasicData.Name = model.Name;
                applicant.BasicData.FirstSurname = model.FirstSurname;
                applicant.BasicData.SecondSurname = model.SecondSurname;
                applicant.PersonalData.Birthday = model.Birthday;
                applicant.PersonalData.IDDocumentIsPermanent = model.IDDocumentIsPermanent;
                applicant.PersonalData.IDDocumentExpirationDate = model.IDDocumentExpirationDate;
                applicant.PersonalData.Gender = model.Gender;
                applicant.PersonalData.IsResident = model.IsResident;


                if (model.Country != null && (applicant.PersonalData.Country != model.Country))
                {
                    tasks.Add(applicantService.UpdateApplicantCountry(new BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request.CountryInfo
                    {
                        CountryId = model.Country.Value,
                        CountryTypeId = (int)CountryType.Birth
                    }, model.DNI));
                }

                if (model.Nacionality != null && (applicant.PersonalData.Nacionality != model.Nacionality))
                {
                    tasks.Add(applicantService.UpdateApplicantCountry(new BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request.CountryInfo
                    {
                        CountryId = model.Nacionality.Value,
                        CountryTypeId = (int)CountryType.Nationality
                    }, model.DNI));
                }

                tasks.Add(applicantService.Update(applicant));

                await Task.WhenAll(tasks).ConfigureAwait(false);

                await CheckForAmlAlerts(model.RequestId).ConfigureAwait(false);

                AddCustomSuccess("Datos editados correctamente");
            }
            catch
            {
                AddCustomError("ha habido un error al editar los datos personales");
            }

            return RedirectToAction("Index", new { requestID = model.RequestId });
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateTitularContactData([FromForm] TitularContactDataModel model)
        {
            try
            {

                var uniqueMobilRequest = new UniqueMobileRequest()
                {
                    DocumentNumber = model.DNI,
                    Mobile = model.MobilePhoneNumber
                };

                var uniqueMobilesResult = await customerService.CheckUniqueMobile(uniqueMobilRequest);

                if (uniqueMobilesResult != null && uniqueMobilesResult.Count > 0) throw new UniqueMobileException();


                var applicant = await applicantService.GetApplicantByDNI(model.DNI).ConfigureAwait(false);
                applicant.BasicData.MobilePhoneNumber = model.MobilePhoneNumber;
                applicant.BasicData.Email = model.Email;
                applicant.PersonalData.PhoneNumber = model.PhoneNumber;

                await applicantService.Update(applicant).ConfigureAwait(false);

                await CheckForAmlAlerts(model.RequestId).ConfigureAwait(false);

                AddCustomSuccess("Datos editados correctamente");
            }
            catch (UniqueMobileException)
            {
                AddCustomError("ha habido un error al editar los datos. El teléfono móvil ya está asignado a otro cliente.");
            }
            catch
            {
                AddCustomError("ha habido un error al editar los datos de contacto");
            }

            return RedirectToAction("Index", new { requestID = model.RequestId });
        }

        [HttpPost]
        //   [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateTitularAddress([FromForm] AddressDataModel model)
        {
            try
            {
                var address = mapper.Map<SignUpAddressData>(model);

                if (address.AddressType == AddressType.Fiscal)
                {
                    var applicant = await applicantService.GetApplicantByDNI(model.DNI).ConfigureAwait(false);
                    if (!model.DifferentPostalAddress)
                    {
                        await applicantService.UpdateAddress(address).ConfigureAwait(false);

                        if (applicant.ContactData.Count == 2 && applicant.ContactData[0].Id != applicant.ContactData[1].Id)
                        {
                            var postal = applicant.ContactData.IndexOf(applicant.ContactData.FirstOrDefault(a => a.AddressType == AddressType.Postal));
                            applicant.ContactData.RemoveAt(postal);
                            var postalFromFiscal = mapper.Map<SignUpAddressData>(model);
                            postalFromFiscal.AddressType = AddressType.Postal;
                            applicant.ContactData.Add(postalFromFiscal);
                            await applicantService.Update(applicant).ConfigureAwait(false);
                        }
                    }
                    else
                    {
                        await applicantService.UpdateAddress(address).ConfigureAwait(false);
                        var postal = applicant.ContactData.IndexOf(applicant.ContactData.FirstOrDefault(a => a.AddressType == AddressType.Postal));
                        applicant.ContactData.RemoveAt(postal);
                        var postalFromFiscal = mapper.Map<SignUpAddressData>(model);
                        postalFromFiscal.AddressType = AddressType.Postal;
                        postalFromFiscal.Id = null;
                        applicant.ContactData.Add(postalFromFiscal);
                        await applicantService.Update(applicant).ConfigureAwait(false);
                    }
                }
                else
                {
                    var applicant = await applicantService.GetApplicantByDNI(model.DNI).ConfigureAwait(false);
                    if (applicant.ContactData.Count == 2)
                    {
                        if (applicant.ContactData[0].Id == applicant.ContactData[1].Id)
                        {
                            var postal = applicant.ContactData.IndexOf(applicant.ContactData.FirstOrDefault(a => a.AddressType == AddressType.Postal));
                            applicant.ContactData.RemoveAt(postal);
                            var postalFromFiscal = mapper.Map<SignUpAddressData>(model);
                            postalFromFiscal.AddressType = AddressType.Postal;
                            postalFromFiscal.Id = null;
                            applicant.ContactData.Add(postalFromFiscal);
                            await applicantService.Update(applicant).ConfigureAwait(false);
                        }
                        else
                        {
                            await applicantService.UpdateAddress(address).ConfigureAwait(false);
                        }
                    }
                }

                await CheckForAmlAlerts(model.RequestId).ConfigureAwait(false);

                AddCustomSuccess("Datos editados correctamente");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error al editar la direción {Message}", ex.Message);
                AddCustomError("ha habido un error al editar la dirección");
            }

            return RedirectToAction("Index", new { requestID = model.RequestId });
        }

        [HttpPost]
        [Route("{dni?}/{question?}")]
        public async Task<IActionResult> GetQuestionDetail([FromRoute] string dni, [FromRoute] int question, [FromBody] ManagementRequestModel model)
        {
            var result = new QuestionDetailModel();
            var requestId = model.Request.Id;
            var applicant = model.Applicants.FirstOrDefault(a => a.Applicant.BasicData.DNI == dni);

            int applicantRole = 0;
            Int32.TryParse(applicant.ApplicantRoleType.Id, out applicantRole);

            var requestTest = await testService.GetTestAnswers(requestId).ConfigureAwait(false);
            var answers = await testService.GetQuestions(applicantRole, applicant.Applicant.BasicData.ApplicantType).ConfigureAwait(false);
            var applicantTest = requestTest.Where(a => a.User.DNI == dni);
            var questionTest = answers.FirstOrDefault(q => q.Id == question);
            var posibleQuestionAnswers = answers.FirstOrDefault(a => a.Id == question).QuestionAnswers;

            var questionAnswers = applicantTest.GroupBy(cc => cc.Question.Id)
                .Where(a => a.Key == question)
                .Select(dd => new
                {
                    answers = dd.Select(e => e.Answer),
                    question = dd.First()
                });

            bool hasAnswers = questionAnswers != null && questionAnswers.Any();
            var role = requestTest.FirstOrDefault().User.Role.Id;

            result.PosibleAnswers = mapper.Map<List<SelectItemModel>>(posibleQuestionAnswers);
            result.RequestId = requestId;
            result.IdApplicant = dni;
            result.IdQuestion = question;
            result.Question = questionTest.Text;
            result.IsRequired = !questionTest.AllowNoAnswer.Value;
            result.QuestionType = questionTest.AllowMultiAnswer.Value ? QuestionType.Check : QuestionType.Text;
            if (hasAnswers)
            {
                result.QuestionType = QuestionType.Combo;
            }
            result.RequestApplicantType = role;
            result.AllowMultiple = questionTest.AllowMultiAnswer.Value;

            if (question == 61)
            {
                result.QuestionType = QuestionType.Check;
            }
            if (question == 23 || question == 24 || question == 47 || question == 52)
            {
                result.QuestionType = QuestionType.Combo;
            }
            if (question == 60)
            {
                result.QuestionType = QuestionType.Check;
            }
            if (question == 39)
            {
                var ap = model.Applicants.FirstOrDefault(a => a.Applicant.BasicData.DNI == dni);
                var resultSecondCountry = mapper.Map<QuestionSecondFiscalCountry>(result);
                resultSecondCountry.Countries = model.Countries;
                resultSecondCountry.QuestionType = QuestionType.Combo;

                if (ap.Countries.Any(c => c.CountryType == (int)CountryType.SecondaryResidence))
                {
                    resultSecondCountry.ComboAnswer = ap.Countries.FirstOrDefault(c => c.CountryType == (int)CountryType.SecondaryResidence).Id;
                    resultSecondCountry.Country = resultSecondCountry.ComboAnswer;
                }

                if (ap.Countries.Any(c => c.CountryType == (int)CountryType.MainResidence))
                {
                    resultSecondCountry.FiscalCountry = ap.Countries.FirstOrDefault(c => c.CountryType == (int)CountryType.MainResidence).Id;
                }

                if (ap.Documents.Any(d => d.Id == IDApplicantDocumentType.PAS || d.Id == IDApplicantDocumentType.DNI || d.Id == IDApplicantDocumentType.TUE))
                {
                    var doc = ap.Documents.FirstOrDefault((d => d.Id == IDApplicantDocumentType.PAS || d.Id == IDApplicantDocumentType.DNI || d.Id == IDApplicantDocumentType.TUE));
                    resultSecondCountry.DocumentType = doc.Id;
                    resultSecondCountry.DocumentNumber = doc.Number;
                    resultSecondCountry.DocumentExpirationDate = doc.ExpirationDate.Value;
                }

                if (ap.Documents.Any(d => d.Id == IDApplicantDocumentType.TIN))
                {
                    var doc = ap.Documents.FirstOrDefault(d => d.Id == IDApplicantDocumentType.TIN);
                    resultSecondCountry.DocumentIdentification = doc.Number;
                }

                return PartialView("_DetailsTestQuestionSecondCountry", resultSecondCountry);
            }

            switch (result.QuestionType)
            {
                case QuestionType.Combo:
                    {
                        result.ComboAnswer = questionAnswers.FirstOrDefault().answers.FirstOrDefault().Id;

                        List<int> comboextendedanswers = [];
                        foreach (var a in posibleQuestionAnswers)
                        {
                            if (a.ExtendedAnswer)
                                comboextendedanswers.Add(a.Id);
                        }
                        result.PosibleExtendedAnswers = comboextendedanswers.ToArray();
                        result.ComboExtendedAnswer = questionAnswers.FirstOrDefault().answers.FirstOrDefault().OtherAnswer;

                        if (question == 47)
                        {
                            var test = questionAnswers.FirstOrDefault();

                            foreach (var a in posibleQuestionAnswers)
                            {
                                var testAnswer1 = test.answers.FirstOrDefault(t => t.Id == a.Id);
                                var answer1 = new BESTINVER.GestorAltas.Web.Management.Models.QuestionAnswerModel
                                {
                                    IdAnswer = a.Id,
                                    Answer = a.Text,
                                    OtherAnswer = testAnswer1 != null ? testAnswer1.OtherAnswer : "",
                                    Checked = testAnswer1 != null,
                                    ExtendedAnswer = a.ExtendedAnswer,
                                    DependedAnswers = a.DependentAnswers.Select(dp => dp.Id).ToArray()
                                };

                                result.Answers.Add(answer1);
                            }
                            foreach (var t in test.answers)
                            {
                                var testAnswer1 = test.answers.FirstOrDefault(j => j.Id == t.Id);
                                var answer1 = new BESTINVER.GestorAltas.Web.Management.Models.QuestionAnswerModel
                                {
                                    IdAnswer = t.Id,
                                    Answer = t.Text,
                                    OtherAnswer = testAnswer1 != null ? testAnswer1.OtherAnswer : "",
                                    Checked = testAnswer1 != null
                                };
                                result.ComboExtendedAnswer = answer1.OtherAnswer != null ? testAnswer1.OtherAnswer : "";
                                result.Answers.Add(answer1);
                            }

                            return PartialView("_DetailsTestQuestionCargo", result);
                        }

                        if (question == 48)
                        {
                            var resultPublic = mapper.Map<QuestionPublicModel>(result);

                            resultPublic.Entidad = questionAnswers.FirstOrDefault(q => q.question.Question.Id == question).answers.FirstOrDefault(a => a.Id == 1018)?.OtherAnswer;
                            resultPublic.Cargo = questionAnswers.FirstOrDefault(q => q.question.Question.Id == question).answers.FirstOrDefault(a => a.Id == 1020)?.OtherAnswer;
                            resultPublic.Departamento = questionAnswers.FirstOrDefault(q => q.question.Question.Id == question).answers.FirstOrDefault(a => a.Id == 1019)?.OtherAnswer;

                            var questionPRP = answers.FirstOrDefault(a => a.Id == 49);
                            var posiblePrpAnswers = questionPRP.QuestionAnswers;
                            var questionType = questionPRP.AllowMultiAnswer.Value ? QuestionType.Check : QuestionType.Text;
                            if (hasAnswers)
                            {
                                questionType = QuestionType.Combo;
                            }

                            var prpQuestion = new QuestionDetailModel()
                            {
                                PosibleAnswers = mapper.Map<List<SelectItemModel>>(posiblePrpAnswers),
                                RequestId = requestId,
                                IdApplicant = dni,
                                IdQuestion = 49,
                                Question = questionPRP.Text,
                                IsRequired = !questionPRP.AllowNoAnswer.Value,
                                QuestionType = questionType,
                                RequestApplicantType = role,
                                AllowMultiple = questionPRP.AllowMultiAnswer.Value
                            };

                            foreach (var a in posiblePrpAnswers)
                            {
                                var answer = new BESTINVER.GestorAltas.Web.Management.Models.QuestionAnswerModel
                                {
                                    IdAnswer = a.Id,
                                    Answer = a.Text,
                                    OtherAnswer = "",
                                    Checked = false,
                                    ExtendedAnswer = a.ExtendedAnswer,
                                };

                                prpQuestion.Answers.Add(answer);
                            }

                            resultPublic.PrpQuestion = prpQuestion;
                            resultPublic.AskForPrpAnswers = resultPublic.ComboAnswer == 135;
                            return PartialView("_DetailsTestQuestionPublicResponsability", resultPublic);
                        }

                        if (question == 50)
                        {
                            var resultAdmin = mapper.Map<QuestionAdminModel>(result);

                            resultAdmin.Entidad = questionAnswers.FirstOrDefault(q => q.question.Question.Id == question).answers.FirstOrDefault(a => a.Id == 1021)?.OtherAnswer;
                            resultAdmin.Cargo = questionAnswers.FirstOrDefault(q => q.question.Question.Id == question).answers.FirstOrDefault(a => a.Id == 1022)?.OtherAnswer;
                            return PartialView("_DetailsTestQuestionAdmin", resultAdmin);
                        }

                        break;
                    }

                case QuestionType.Check:
                    {
                        var test = questionAnswers.FirstOrDefault();

                        foreach (var a in posibleQuestionAnswers)
                        {
                            var testAnswer = test.answers.FirstOrDefault(t => t.Id == a.Id);
                            var answer = new BESTINVER.GestorAltas.Web.Management.Models.QuestionAnswerModel
                            {
                                IdAnswer = a.Id,
                                Answer = a.Text,
                                OtherAnswer = testAnswer != null ? testAnswer.OtherAnswer : "",
                                Checked = testAnswer != null,
                                ExtendedAnswer = a.ExtendedAnswer,
                            };

                            foreach (var subanswer in a.DependentAnswers)
                            {
                                answer.SubAnswers.Add(new Models.QuestionAnswerModel
                                {
                                    Answer = subanswer.Text,
                                    IdAnswer = subanswer.Id,
                                    Checked = questionAnswers.Any(q => q.question.Question.Id == question && q.answers.Any(an => an.Id == subanswer.Id)),
                                    ExtendedAnswer = subanswer.ExtendedAnswer,
                                    OtherAnswer = test.answers.FirstOrDefault(d => d.Id == subanswer.Id)?.OtherAnswer
                                });
                            }

                            result.Answers.Add(answer);
                        }

                        if (question == 46)
                        {
                            return PartialView("_DetailsTestQuestionSector", result);
                        }
                        if (question == 49)
                        {
                            result.AllowMultiple = false;
                            return PartialView("_DetailsTestQuestionView", result);
                        }
                        if (question == 60)
                        {
                            return PartialView("_DetailsTestQuestionFACTA", result);
                        }
                        if (question == 61)
                        {
                            result.Answers.FirstOrDefault(a => a.IdAnswer == 191).ExtendedAnswer = false;
                            return PartialView("_DetailsTestQuestionSector", result);
                        }

                        break;
                    }
            }

            return PartialView("_DetailsTestQuestionView", result);
        }

        [HttpPost]
        public async Task<IActionResult> SaveQuestionDetail(QuestionDetailModel model)
        {
            try
            {
                List<Test> questionsToUpdate = [];

                if (model.QuestionType == QuestionType.Combo)
                {
                    Test test = new()
                    {
                        RequestId = model.RequestId,
                        User = new TestUser
                        {
                            DNI = model.IdApplicant,
                            Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                            {
                                Id = model.RequestApplicantType
                            }
                        },

                        Question = new TestQuestion
                        {
                            Id = model.IdQuestion
                        },

                        Answer = new TestAnswer
                        {
                            Id = model.ComboAnswer,
                            OtherAnswer = model.ComboExtendedAnswer
                        }
                    };
                    if (test.Question.Id == 47)
                    {
                        test.Answer = new TestAnswer
                        {
                            Id = model.ComboAnswer
                        };

                        if (model.Answers.FirstOrDefault(a => a.IdAnswer == model.ComboAnswer).DependedAnswers.Length != 0)
                        {
                            var dependedAnwer = new TestAnswer
                            {
                                Id = model.Answers.FirstOrDefault(a => a.IdAnswer == model.ComboAnswer).DependedAnswers.FirstOrDefault(),
                                OtherAnswer = model.ComboExtendedAnswer
                            };

                            questionsToUpdate.Add(new Test
                            {
                                Question = new TestQuestion
                                {
                                    Id = model.IdQuestion
                                },
                                Answer = dependedAnwer,
                                RequestId = model.RequestId,
                                User = new TestUser
                                {
                                    DNI = model.IdApplicant,
                                    Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                                    {
                                        Id = model.RequestApplicantType
                                    }
                                }
                            });
                        }
                    }

                    questionsToUpdate.Add(test);

                    await testService.UpdateTestQuestion(questionsToUpdate).ConfigureAwait(false);
                }

                if (model.QuestionType == QuestionType.Check)
                {
                    foreach (var answer in model.Answers.Where(a => a.Checked))
                    {
                        Test test = new()
                        {
                            RequestId = model.RequestId,
                            User = new TestUser
                            {
                                DNI = model.IdApplicant,
                                Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                                {
                                    Id = model.RequestApplicantType
                                }
                            },

                            Question = new TestQuestion
                            {
                                Id = model.IdQuestion
                            },

                            Answer = new TestAnswer
                            {
                                Id = answer.IdAnswer,
                                OtherAnswer = answer.OtherAnswer
                            }
                        };

                        questionsToUpdate.Add(test);
                    }

                    await testService.UpdateTestQuestion(questionsToUpdate).ConfigureAwait(false);
                }

                await CheckForAmlAlerts(model.RequestId).ConfigureAwait(false);

                return RedirectToAction("Index", new { requestID = model.RequestId });
            }
            catch
            {
                AddCustomError("Se ha producido un error");
                return RedirectToAction("Index", new { requestID = model.RequestId });
            }
        }

        [HttpPost]
        public async Task<IActionResult> SaveQuestionSectorDetail(QuestionDetailModel model)
        {
            try
            {
                if (model.Answers.Count(a => a.Checked) > 1 || !model.Answers.Any(a => a.Checked))
                {
                    AddCustomError("No se pudo modificar la pregunta, debe seleccionar un sector");
                    return RedirectToAction("Index", new { requestID = model.RequestId });
                }

                List<Test> questionsToUpdate = [];

                foreach (var answer in model.Answers.Where(a => a.Checked))
                {
                    Test test = new();
                    if (model.IdQuestion == 49 && answer.OtherAnswer == null)
                    {
                        AddCustomError("Ha ocurrido un error, campo vacío");
                        return RedirectToAction("Index", new { requestID = model.RequestId });
                    }
                    test.RequestId = model.RequestId;
                    test.User = new TestUser
                    {
                        DNI = model.IdApplicant,
                        Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                        {
                            Id = model.RequestApplicantType
                        }
                    };

                    test.Question = new TestQuestion
                    {
                        Id = model.IdQuestion
                    };

                    test.Answer = new TestAnswer
                    {
                        Id = answer.IdAnswer,
                        OtherAnswer = answer.OtherAnswer,
                    };

                    questionsToUpdate.Add(test);

                    if (answer.SubAnswers.Count(a => a.Checked) > 1 || !answer.SubAnswers.Any(a => a.Checked) && answer.Checked && answer.SubAnswers.Count != 0)
                    {
                        AddCustomError("No se pudo modificar la pregunta, debe seleccionar un subsector");
                        return RedirectToAction("Index", new { requestID = model.RequestId });
                    }
                    if (answer.SubAnswers.Count < 1 && model.Answers.Any(d => d.SubAnswers.Any(j => j.Checked)))
                    {
                        AddCustomError("No se pudo modificar la pregunta, debe seleccionar un subsector correcto");
                        return RedirectToAction("Index", new { requestID = model.RequestId });
                    }
                    if (model.Answers.Count(h => h.SubAnswers.Any(o => o.Checked)) > 1)
                    {
                        AddCustomError("No se pudo modificar la pregunta, debe seleccionar un subsector correcto");
                        return RedirectToAction("Index", new { requestID = model.RequestId });
                    }
                    if (answer.SubAnswers != null)
                    {
                        foreach (var sub in answer.SubAnswers.Where(a => a.Checked))
                        {
                            test = new Test
                            {
                                RequestId = model.RequestId,
                                User = new TestUser
                                {
                                    DNI = model.IdApplicant,
                                    Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                                    {
                                        Id = model.RequestApplicantType
                                    }
                                },

                                Question = new TestQuestion
                                {
                                    Id = model.IdQuestion
                                },
                                Answer = new TestAnswer
                                {
                                    Id = sub.IdAnswer,
                                    OtherAnswer = sub.OtherAnswer
                                }
                            };
                            if (sub.IdAnswer == 1039 && sub.Checked && test.Answer.OtherAnswer == null || test.Answer.OtherAnswer == "")
                            {
                                AddCustomError("Ha ocurrido un error, campo vacío");
                                return RedirectToAction("Index", new { requestID = model.RequestId });
                            }

                            questionsToUpdate.Add(test);
                        }
                    }
                }

                await testService.UpdateTestQuestion(questionsToUpdate).ConfigureAwait(false);

                await CheckForAmlAlerts(model.RequestId).ConfigureAwait(false);

                return RedirectToAction("Index", new { requestID = model.RequestId });
            }
            catch
            {
                AddCustomError("Se ha producido un error");
                return RedirectToAction("Index", new { requestID = model.RequestId });
            }
        }

        [HttpPost]
        public async Task<IActionResult> SaveQuestionFACTADetail(QuestionDetailModel model)
        {
            try
            {
                if (model.Answers.Count(a => a.Checked) > 1 || !model.Answers.Any(a => a.Checked))
                {
                    AddCustomError("No se pudo modificar la pregunta, debe seleccionar un sector");
                    return RedirectToAction("Index", new { requestID = model.RequestId });
                }

                List<Test> questionsToUpdate = [];

                foreach (var answer in model.Answers.Where(a => a.Checked))
                {
                    Test test = new()
                    {
                        RequestId = model.RequestId,
                        User = new TestUser
                        {
                            DNI = model.IdApplicant,
                            Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                            {
                                Id = model.RequestApplicantType
                            }
                        },

                        Question = new TestQuestion
                        {
                            Id = model.IdQuestion
                        },

                        Answer = new TestAnswer
                        {
                            Id = answer.IdAnswer,
                            OtherAnswer = answer.OtherAnswer,
                        }
                    };

                    questionsToUpdate.Add(test);

                    if (answer.SubAnswers.Count(a => a.Checked) > 1 || !answer.SubAnswers.Any(a => a.Checked) && answer.Checked && answer.SubAnswers.Count != 0)
                    {
                        AddCustomError("No se pudo modificar la pregunta, debe seleccionar un subsector");
                        return RedirectToAction("Index", new { requestID = model.RequestId });
                    }
                    if (answer.SubAnswers != null)
                    {
                        foreach (var sub in answer.SubAnswers.Where(a => a.Checked))
                        {
                            if (sub.IdAnswer == 1050 || sub.IdAnswer == 1047 && sub.Checked && sub.OtherAnswer == null || sub.OtherAnswer == "")
                            {
                                AddCustomError("No se pudo modificar la pregunta, debe rellenar toda la información");
                                return RedirectToAction("Index", new { requestID = model.RequestId });
                            }
                            if (sub.IdAnswer == 1053)
                            {
                                test = new Test
                                {
                                    RequestId = model.RequestId,
                                    User = new TestUser
                                    {
                                        DNI = model.IdApplicant,
                                        Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                                        {
                                            Id = model.RequestApplicantType
                                        }
                                    },

                                    Question = new TestQuestion
                                    {
                                        Id = model.IdQuestion
                                    },
                                    Answer = new TestAnswer
                                    {
                                        Id = sub.IdAnswer,
                                        OtherAnswer = sub.OtherAnswer
                                    }
                                };
                                if (sub.ExtendedAnswer && test.Answer.OtherAnswer == null)
                                {
                                    AddCustomError("No se pudo modificar la pregunta, debe rellenar toda la información");
                                    return RedirectToAction("Index", new { requestID = model.RequestId });
                                }
                                questionsToUpdate.Add(test);
                                test = new Test
                                {
                                    RequestId = model.RequestId,
                                    User = new TestUser
                                    {
                                        DNI = model.IdApplicant,
                                        Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                                        {
                                            Id = model.RequestApplicantType
                                        }
                                    },

                                    Question = new TestQuestion
                                    {
                                        Id = model.IdQuestion
                                    },
                                    Answer = new TestAnswer
                                    {
                                        Id = 1054,
                                        OtherAnswer = answer.SubAnswers.FirstOrDefault(h => h.IdAnswer == 1054).OtherAnswer
                                    }
                                };
                                if (test.Answer.OtherAnswer == null)
                                {
                                    AddCustomError("No se pudo modificar la pregunta, debe rellenar toda la información");
                                    return RedirectToAction("Index", new { requestID = model.RequestId });
                                }
                                questionsToUpdate.Add(test);
                                test = new Test
                                {
                                    RequestId = model.RequestId,
                                    User = new TestUser
                                    {
                                        DNI = model.IdApplicant,
                                        Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                                        {
                                            Id = model.RequestApplicantType
                                        }
                                    },

                                    Question = new TestQuestion
                                    {
                                        Id = model.IdQuestion
                                    },
                                    Answer = new TestAnswer
                                    {
                                        Id = 1055,
                                        OtherAnswer = answer.SubAnswers.FirstOrDefault(h => h.IdAnswer == 1055).OtherAnswer
                                    }
                                };
                                if (test.Answer.OtherAnswer == null)
                                {
                                    AddCustomError("No se pudo modificar la pregunta, debe rellenar toda la información");
                                    return RedirectToAction("Index", new { requestID = model.RequestId });
                                }
                                questionsToUpdate.Add(test);
                            }
                            else
                            {
                                test = new Test
                                {
                                    RequestId = model.RequestId,
                                    User = new TestUser
                                    {
                                        DNI = model.IdApplicant,
                                        Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                                        {
                                            Id = model.RequestApplicantType
                                        }
                                    },

                                    Question = new TestQuestion
                                    {
                                        Id = model.IdQuestion
                                    },
                                    Answer = new TestAnswer
                                    {
                                        Id = sub.IdAnswer,
                                        OtherAnswer = sub.OtherAnswer
                                    }
                                };
                                questionsToUpdate.Add(test);
                            }
                        }
                    }
                }

                await testService.UpdateTestQuestion(questionsToUpdate).ConfigureAwait(false);

                await CheckForAmlAlerts(model.RequestId).ConfigureAwait(false);

                return RedirectToAction("Index", new { requestID = model.RequestId });
            }
            catch
            {
                AddCustomError("Se ha producido un error");
                return RedirectToAction("Index", new { requestID = model.RequestId });
            }
        }

        [HttpPost]
        public async Task<IActionResult> SaveQuestionPublicDetail(QuestionPublicModel model)
        {
            try
            {
                List<Test> questionsToUpdate = [];
                List<Task> tasks = [];

                if (model.QuestionType == QuestionType.Combo)
                {
                    if (model.ComboAnswer == 135)
                    {
                        model.Entidad = null;
                        model.Departamento = null;
                        model.Cargo = null;

                        var requestTest = await testService.GetTestAnswers(model.RequestId).ConfigureAwait(false);
                        var applicantTest = requestTest.Where(a => a.User.DNI == model.IdApplicant);
                        var prpQuestion = applicantTest.FirstOrDefault(t => t.Question.Id == 49);

                        if (prpQuestion != null)
                        {
                            tasks.Add(testService.RemoveQuestion(
                            [
                                prpQuestion
                            ]
                            ));
                        }
                    }
                    else
                    {
                        var prpAnswer = model.PrpQuestion.Answers.FirstOrDefault(a => a.Checked);
                        var prpquestion = new Test
                        {
                            User = new TestUser
                            {
                                DNI = model.IdApplicant,
                                Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                                {
                                    Id = model.RequestApplicantType
                                }
                            },
                            RequestId = model.RequestId,
                            Question = new TestQuestion
                            {
                                Id = model.PrpQuestion.IdQuestion
                            },
                            Answer = new TestAnswer
                            {
                                Id = prpAnswer.IdAnswer,
                                OtherAnswer = prpAnswer.OtherAnswer
                            }
                        };
                        tasks.Add(testService.UpdateTestQuestion(
                        [
                            prpquestion
                        ]
                        ));
                    }

                    Test test = new()
                    {
                        RequestId = model.RequestId,
                        User = new TestUser
                        {
                            DNI = model.IdApplicant,
                            Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                            {
                                Id = model.RequestApplicantType
                            }
                        },

                        Question = new TestQuestion
                        {
                            Id = model.IdQuestion
                        },
                        Answer = new TestAnswer
                        {
                            Id = model.ComboAnswer,
                        }
                    };
                    questionsToUpdate.Add(test);

                    if (!string.IsNullOrEmpty(model.Entidad))
                    {
                        test = new Test
                        {
                            RequestId = model.RequestId,
                            User = new TestUser
                            {
                                DNI = model.IdApplicant,
                                Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                                {
                                    Id = model.RequestApplicantType
                                }
                            },

                            Question = new TestQuestion
                            {
                                Id = model.IdQuestion
                            },
                            Answer = new TestAnswer
                            {
                                Id = 1018,
                                OtherAnswer = model.Entidad
                            }
                        };
                        questionsToUpdate.Add(test);
                    }
                    if (!string.IsNullOrEmpty(model.Departamento))
                    {
                        test = new Test
                        {
                            RequestId = model.RequestId,
                            User = new TestUser
                            {
                                DNI = model.IdApplicant,
                                Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                                {
                                    Id = model.RequestApplicantType
                                }
                            },

                            Question = new TestQuestion
                            {
                                Id = model.IdQuestion
                            },
                            Answer = new TestAnswer
                            {
                                Id = 1019,
                                OtherAnswer = model.Departamento
                            }
                        };
                        questionsToUpdate.Add(test);
                    }
                    if (!string.IsNullOrEmpty(model.Cargo))
                    {
                        test = new Test
                        {
                            RequestId = model.RequestId,
                            User = new TestUser
                            {
                                DNI = model.IdApplicant,
                                Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                                {
                                    Id = model.RequestApplicantType
                                }
                            },

                            Question = new TestQuestion
                            {
                                Id = model.IdQuestion
                            },
                            Answer = new TestAnswer
                            {
                                Id = 1020,
                                OtherAnswer = model.Cargo
                            }
                        };
                        questionsToUpdate.Add(test);
                    }

                    tasks.Add(testService.UpdateTestQuestion(questionsToUpdate));

                    await Task.WhenAll(tasks).ConfigureAwait(false);
                }

                await CheckForAmlAlerts(model.RequestId).ConfigureAwait(false);

                return RedirectToAction("Index", new { requestID = model.RequestId });
            }
            catch
            {
                AddCustomError("Se ha producido un error");
                return RedirectToAction("Index", new { requestID = model.RequestId });
            }
        }

        [HttpPost]
        public async Task<IActionResult> SaveQuestionAdminDetail(QuestionAdminModel model)
        {
            try
            {
                List<Test> questionsToUpdate = [];

                if (model.QuestionType == QuestionType.Combo)
                {
                    Test test = new()
                    {
                        RequestId = model.RequestId,
                        User = new TestUser
                        {
                            DNI = model.IdApplicant,
                            Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                            {
                                Id = model.RequestApplicantType
                            }
                        },

                        Question = new TestQuestion
                        {
                            Id = model.IdQuestion
                        },
                        Answer = new TestAnswer
                        {
                            Id = model.ComboAnswer,
                        }
                    };
                    questionsToUpdate.Add(test);

                    if (model.ComboAnswer == 137)
                    {
                        model.Entidad = null;
                        model.Cargo = null;
                    }
                    if (!string.IsNullOrEmpty(model.Entidad))
                    {
                        test = new Test
                        {
                            RequestId = model.RequestId,
                            User = new TestUser
                            {
                                DNI = model.IdApplicant,
                                Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                                {
                                    Id = model.RequestApplicantType
                                }
                            },

                            Question = new TestQuestion
                            {
                                Id = model.IdQuestion
                            },
                            Answer = new TestAnswer
                            {
                                Id = 1021,
                                OtherAnswer = model.Entidad
                            }
                        };
                        if (test.Answer.OtherAnswer == null)
                        {
                            AddCustomError("No se pudo modificar la pregunta, debe rellenar toda la información");
                            return RedirectToAction("Index", new { requestID = model.RequestId });
                        }
                        questionsToUpdate.Add(test);
                    }

                    if (!string.IsNullOrEmpty(model.Cargo))
                    {
                        test = new Test
                        {
                            RequestId = model.RequestId,
                            User = new TestUser
                            {
                                DNI = model.IdApplicant,
                                Role = new BestInver.WebPrivada.Shared.Models.Microservices.Users.UserRole
                                {
                                    Id = model.RequestApplicantType
                                }
                            },

                            Question = new TestQuestion
                            {
                                Id = model.IdQuestion
                            },
                            Answer = new TestAnswer
                            {
                                Id = 1022,
                                OtherAnswer = model.Cargo
                            }
                        };
                        if (test.Answer.OtherAnswer == null)
                        {
                            AddCustomError("No se pudo modificar la pregunta, debe rellenar toda la información");
                            return RedirectToAction("Index", new { requestID = model.RequestId });
                        }
                        questionsToUpdate.Add(test);
                    }

                    await testService.UpdateTestQuestion(questionsToUpdate).ConfigureAwait(false);
                }

                await CheckForAmlAlerts(model.RequestId).ConfigureAwait(false);

                return RedirectToAction("Index", new { requestID = model.RequestId });
            }
            catch
            {
                AddCustomError("Se ha producido un error");
                return RedirectToAction("Index", new { requestID = model.RequestId });
            }
        }

        [HttpPost]
        public async Task<IActionResult> SaveQuestionSecondCountryDetail(QuestionSecondFiscalCountry model)
        {
            try
            {
                var applicant = await applicantService.GetApplicantByDNI(model.IdApplicant).ConfigureAwait(false);
                var applicantDoc = applicant.ApplicantIDDocuments.FirstOrDefault(d => d.DocumentID == IDApplicantDocumentType.PAS || d.DocumentID == IDApplicantDocumentType.DNI || d.DocumentID == IDApplicantDocumentType.TUE);

                if (!model.Country.HasValue)
                {
                    await applicantService.DeleteApplicantCountry(model.IdApplicant, ((int)CountryType.SecondaryResidence).ToString()).ConfigureAwait(false);
                    await applicantService.DeleteApplicantDocument(model.IdApplicant, (applicantDoc != null) ? applicantDoc.DocumentID : "").ConfigureAwait(false);
                    await applicantService.DeleteApplicantDocument(model.IdApplicant, IDApplicantDocumentType.TIN).ConfigureAwait(false);
                }
                else
                {
                    await applicantService.UpdateApplicantCountry(new CountryInfo
                    {
                        CountryId = model.Country.Value,
                        CountryTypeId = (int)CountryType.SecondaryResidence
                    }, model.IdApplicant).ConfigureAwait(false);


                    await applicantService.UpdateApplicantDocument(new IdDocumentInfo
                    {
                        Id = IDApplicantDocumentType.TIN,
                        Number = model.DocumentIdentification
                    }, model.IdApplicant).ConfigureAwait(false);

                    if (applicantDoc != null && applicantDoc.DocumentID != model.DocumentType)
                    {
                        await applicantService.DeleteApplicantDocument(model.IdApplicant, applicantDoc.DocumentID).ConfigureAwait(false);
                        await applicantService.SetApplicantDocument(new IdDocumentInfo
                        {
                            Id = model.DocumentType,
                            Number = model.DocumentNumber,
                            ExpirationDate = model.DocumentExpirationDate
                        }, model.IdApplicant).ConfigureAwait(false);
                    }
                    else
                    {
                        await applicantService.UpdateApplicantDocument(new IdDocumentInfo
                        {
                            Id = model.DocumentType,
                            Number = model.DocumentNumber,
                            ExpirationDate = model.DocumentExpirationDate
                        }, model.IdApplicant).ConfigureAwait(false);
                    }

                }

                await CheckForAmlAlerts(model.RequestId).ConfigureAwait(false);

                return RedirectToAction("Index", new { requestID = model.RequestId });
            }
            catch
            {
                AddCustomError("Se ha producido un error");
                return RedirectToAction("Index", new { requestID = model.RequestId });
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateCotitular([FromForm] CotitularDataModel model)
        {
            try
            {
                var uniqueMobilRequest = new UniqueMobileRequest()
                {
                    DocumentNumber = model.DNI,
                    Mobile = model.MobilePhoneNumber
                };

                var uniqueMobilesResult = await customerService.CheckUniqueMobile(uniqueMobilRequest);

                if (uniqueMobilesResult != null && uniqueMobilesResult.Count > 0) throw new UniqueMobileException();


                List<Task> tasks = [];
                var applicant = await applicantService.GetApplicantByDNI(model.DNI).ConfigureAwait(false);
                applicant.BasicData.Name = model.Name;
                applicant.BasicData.FirstSurname = model.FirstSurname;
                applicant.BasicData.SecondSurname = model.SecondSurname;
                applicant.PersonalData.Birthday = model.Birthday;
                applicant.PersonalData.IDDocumentIsPermanent = model.IDDocumentIsPermanent;
                applicant.PersonalData.IDDocumentExpirationDate = model.IDDocumentExpirationDate;
                applicant.PersonalData.Gender = model.Gender;
                applicant.PersonalData.IsResident = model.IsResident;
                applicant.BasicData.MobilePhoneNumber = model.MobilePhoneNumber;
                applicant.BasicData.Email = model.Email;
                applicant.PersonalData.PhoneNumber = model.PhoneNumber;

                if (applicant.PersonalData.Country != model.Country)
                {
                    tasks.Add(applicantService.UpdateApplicantCountry(new BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request.CountryInfo
                    {
                        CountryId = model.Country.Value,
                        CountryTypeId = (int)CountryType.Birth
                    }, model.DNI));
                }

                if (applicant.PersonalData.Nacionality != model.Nacionality)
                {
                    tasks.Add(applicantService.UpdateApplicantCountry(new BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request.CountryInfo
                    {
                        CountryId = model.Nacionality.Value,
                        CountryTypeId = (int)CountryType.Nationality
                    }, model.DNI));
                }

                var fiscalAddress = mapper.Map<SignUpAddressData>(model.FiscalAddress);
                tasks.Add(applicantService.UpdateAddress(fiscalAddress));

                //Tienen distinta dirección fiscal y postal
                if (model.DifferentPostalAddress)
                {
                    //Antes eran iguales fiscal y postal
                    if (applicant.ContactData[0].Id == applicant.ContactData[1].Id)
                    {
                        //Eliminar la dirección postal que tenía
                        //Guardar la nueva postal que viene del modelo
                        var postal = applicant.ContactData.IndexOf(applicant.ContactData.FirstOrDefault(a => a.AddressType == AddressType.Postal));
                        applicant.ContactData.RemoveAt(postal);
                        var postalFromFiscal = mapper.Map<SignUpAddressData>(model.PostalAddress);
                        postalFromFiscal.AddressType = AddressType.Postal;
                        postalFromFiscal.Id = null;
                        applicant.ContactData.Add(postalFromFiscal);
                    }
                    else
                    {
                        //Siguen siendo diferentes
                        //Se actualiza la dirección postal
                        var postalAddress = mapper.Map<SignUpAddressData>(model.PostalAddress);
                        tasks.Add(applicantService.UpdateAddress(postalAddress));
                    }
                }
                else //Tienen la misma dirección fiscal y postal
                {
                    //Antes eran distintas fiscal y postal
                    if (applicant.ContactData[0].Id != applicant.ContactData[1].Id)
                    {
                        //Eliminar la dirección postal que tenía 
                        //Añadir la fiscal como la nueva postal
                        var postal = applicant.ContactData.IndexOf(applicant.ContactData.FirstOrDefault(a => a.AddressType == AddressType.Postal));
                        applicant.ContactData.RemoveAt(postal);
                        var postalFromFiscal = mapper.Map<SignUpAddressData>(model.FiscalAddress);
                        postalFromFiscal.AddressType = AddressType.Postal;
                        applicant.ContactData.Add(postalFromFiscal);
                    }
                    //Si siguen siendo iguales
                    //Como la fiscal ya la hemos modificado, no se hace nada
                }

                tasks.Add(applicantService.Update(applicant));

                await Task.WhenAll(tasks).ConfigureAwait(false);

                await CheckForAmlAlerts(model.RequestId).ConfigureAwait(false);

                AddCustomSuccess("Datos editados correctamente");
            }
            catch (UniqueMobileException)
            {
                AddCustomError("ha habido un error al editar los datos. El teléfono móvil ya está asignado a otro cliente.");
            }
            catch
            {
                AddCustomError("ha habido un error al editar los datos");
            }

            return RedirectToAction("Index", new { requestID = model.RequestId });
        }

        private async Task CheckForAmlAlerts(Guid requestID)
        {
            await amlService.CheckForAmlAlerts(requestID).ConfigureAwait(false);
            var request = await requestService.GetRequest(requestID).ConfigureAwait(false);
            var lastStatus = request.Status.OrderByDescending(r => r.StartDate).FirstOrDefault();

            var alerts = await alertService.Search(new RequestAlertMOSearch { IdRequest = requestID }).ConfigureAwait(false);
            if (alerts.Items.Any(a => a.EndDate == null && a.AlertType.Id == (int)AlertTypes.AlertaPBC))
            {
                if (lastStatus.IdStatus != (int)RequestStatusEnum.Locked)
                {
                    var status = new RequestStatus
                    {
                        IdRequest = requestID,
                        Comments = "",
                        StartDate = DateTime.UtcNow,
                        Responsible = User.Identity.Name,
                        IdStatus = (int)RequestStatusEnum.Locked
                    };

                    var statusList = new List<RequestStatus>
                    {
                        status
                    };

                    await requestService.Add(statusList).ConfigureAwait(false);
                }
            }
            else
            {
                if (lastStatus.IdStatus == (int)RequestStatusEnum.Locked)
                {
                    var newStatus = registerService.UpdateRequestStatus(request);
                    if (lastStatus.IdStatus != newStatus.IdStatus)
                    {
                        List<RequestStatus> status = [newStatus];
                        await requestService.Add(status).ConfigureAwait(false);
                    }
                }
            }
        }

        #endregion Cotitulares

        #region Representatives Sign

        [HttpPost]
        public async Task<IActionResult> UploadSubscriptionDeal([FromForm] UploadSubscriptionDealModel model)
        {
            if (model.SignDate == null)
                AddCustomError("Se debe seleccionar una fecha de firma.");

            if (model.File == null)
                AddCustomError("Se debe seleccionar un fichero pdf.");

            var request = new UploadSuscriptionDealRequest
            {
                RequestId = model.RequestId,
                SignDate = model.SignDate.Value,
                DNI = model.DNI,
                FileName = model.FileName.Replace(".pdf", "_fdoCliente.pdf"),
                Base64File = GetFileInBase64(model),
                User = User.Identity.Name
            };

            bool resul = await _representativesService.UploadSuscriptionDealSign(request);

            if (!resul)
                AddCustomError("Ha habido un error en el proceso. Contacte con el Administrador");

            return RedirectToAction("Index", new
            {
                requestID = model.RequestId
            });
        }

        [HttpGet]
        public async Task<IActionResult> SendToMailTeck(Guid requestId)
        {
            bool resul = await _representativesService.SendToMailTeck(requestId);

            if (!resul)
                AddCustomError("Ha habido un error en el proceso. Contacte con el Administrador");

            return RedirectToAction("Index", new
            {
                requestID = requestId
            });
        }

        private async Task ConfigureRepresentativesButtons(Request request, ManagementRequestModel model)
        {
            if (RequiereRepresentativeSign(request))
                await SetUpRepresentativesButtons(request, model);

            SetUpRetryRepresentativesButton(request, model);

            model.ProductFamilyRequiereCommitment = (request.Product.FamilyProductId == 12);
        }

        private void SetUpRetryRepresentativesButton(Request request, ManagementRequestModel model)
        {
            if (!User.IsInRole(DefaultRoles.Admin))
                return;

            if (!IsRequestInState(request, RequestStatusEnum.Representatives_Sign))
                return;

            model.ShowRetryRepresentativeSignButton = true;
        }

        private static bool RequiereRepresentativeSign(Request request)
        {
            return IsRequestInState(request, RequestStatusEnum.Representatives_Sign) && ProductHasRepresentativeSign(request);
        }

        private async Task SetUpRepresentativesButtons(Request request, ManagementRequestModel model)
        {
            if (request == null)
                return;

            //Digital o manuscrita
            var document = request.RequestDocumentGroup;

            if (document == null)
                return;

            bool manual = document.DocumentSignatureTypeId == 2;//BGR: 1 Digital - 2 Manuscrita

            var singStatus = new SignedStatus { RequestId = request.Id.ToString(), SignerDNI = string.Empty };

            var docstosing = await _representativesService.GetNecessaryDocumentsForProduct(request.Product.Id).ConfigureAwait(false);

            var doc = docstosing.FirstOrDefault();

            if (doc == null)
                return;

            var documentsFromEcertic = await signaturesService.GetDocumentSignedStatus(singStatus).ConfigureAwait(false);

            if (documentsFromEcertic == null || documentsFromEcertic.DocFiles == null)
                return;

            var docs = documentsFromEcertic.DocFiles.FirstOrDefault();
            var docsSigned = documentsFromEcertic.DocSignedFiles.FirstOrDefault();

            //Recuperar acuerdo de suscripcion y estado (firmado/no)
            var acuerdoDeSuscripcion = GetDocToSign(docs, doc);
            var acuerdoDeSuscripcionFirmado = GetDocToSign(docsSigned, doc);

            if (acuerdoDeSuscripcion == null)
                return;

            bool firmado = false;
            if (acuerdoDeSuscripcionFirmado != null)
            {
                firmado = acuerdoDeSuscripcionFirmado.SignatureDate.HasValue;
            }

            model.FileNameToSign = acuerdoDeSuscripcion.Filename;
            SetDocumentToSignDNI(model, acuerdoDeSuscripcion);

            //If Manuscrita
            //Comprobar que el estado del fichero acuerdo de suscripcion
            //si esta firmado - no se hablita el boton subir "acuerdo de suscripcion"
            //si no esta firmado - se habilita el aboton de "acuerdo de suscripcion"
            if (manual)
                SetUpManualSignlRepresentativesButtons(model, firmado, request);
            else
                SetUpDigitalRepresentativesButtons(request, model, firmado);
        }

        private static void SetDocumentToSignDNI(ManagementRequestModel model, DocFile acuerdoDeSuscripcion)
        {
            try
            {
                if (acuerdoDeSuscripcion != null && acuerdoDeSuscripcion.XmlData != null && !string.IsNullOrEmpty(acuerdoDeSuscripcion.XmlData.ndni))
                {
                    model.DocumentToSignDNI = acuerdoDeSuscripcion.XmlData.ndni;
                }
            }
            catch
            {

            }
        }

        private static void SetUpDigitalRepresentativesButtons(Request request, ManagementRequestModel model, bool firmado)
        {
            if (request.Product == null)
                return;

            if (model == null)
                return;

            //Si no es envio por lotes
            //Si esta firmado -> sale el boton "Firma de apoderados" -> envia a mailteck y cambia el estado al 29
            if (!IsProductBatchType(request.Product) && request.TransactionId == null)
                model.ShowRepresentativeSignButton = firmado;

            //Si no esta firmado -> no sale el boton

            //Si el envio es por lotes No se ve nada ya que el proceso es automatico por SQL job
        }

        private static void SetUpManualSignlRepresentativesButtons(ManagementRequestModel model, bool firmado, Request request)
        {
            model.ShowUploadSubscriptionDealButton = !firmado;

            //En caso de no ser envio por bloques
            //If Digital
            //Comprobar que no es envio por lotes
            if (!IsProductBatchType(request.Product) && request.TransactionId == null)
                model.ShowRepresentativeSignButton = firmado;
        }

        private static bool IsRequestInState(Request request, RequestStatusEnum state)
        {
            if (request == null)
                return false;

            var status = request.GetStatus();

            if (status == null)
                return false;

            if (status.IdStatus == null)
                return false;

            return status.IdStatus.Value == (int)state;
        }

        private static bool ProductHasRepresentativeSign(Request request)
        {
            var product = request.Product;

            if (product == null)
                return false;

            if (!product.RepresentativeSign.HasValue)
                return false;

            return product.RepresentativeSign.Value;
        }

        private static bool IsProductBatchType(RequestProduct product)
        {
            if (product == null)
                return false;

            var bacthtype = product.BatchSignTypes;

            if (bacthtype == null)
                return false;

            return bacthtype.IdBatchSignType == (int)EProductBatchType.Batch;
        }

        private static DocFile GetDocToSign(IList<DocFile> docs, string doc)
        {
            DocFile resul = null;

            if (docs == null || docs.Count == 0)
                return resul;

            resul = docs.FirstOrDefault(x => x.Filename == doc);

            return resul;
        }

        private static string GetFileInBase64(UploadSubscriptionDealModel model)
        {
            var file = model.File;
            var ms = new MemoryStream();
            file.CopyTo(ms);
            return Convert.ToBase64String(ms.ToArray());
        }
        #endregion

        #region PeriodicsOperations
        public IActionResult ShowConfirmationModal(Guid idRequest, string confirmationType)
        {
            ViewBag.IdRequest = idRequest;
            ViewBag.ConfirmationType = confirmationType;
            return PartialView("_ConfirmationView");
        }

        public async Task<IActionResult> GetPeriodicOperationDetails(Guid idRequest, int idOperation, int idProduct, bool sendPSD2)
        {
            var request = await requestService.GetRequest(idRequest).ConfigureAwait(false);
            var requestOperation = request.ProductOperations.FirstOrDefault(po => po.Operation.IdOperationType == (int)OperationTypeMOEnum.PeriodicSuscription ||
                po.Operation.IdOperationType == (int)OperationTypeMOEnum.PeriodicSuscriptionPsd2);

            var model = mapper.Map<UpdateRequestPeriodicOperationModel>(requestOperation);
            model.RequestId = idRequest;
            model.AccountId = int.Parse(request.IdCuenta);

            var accountCustomers = await portfoliosService.GetAccountData(int.Parse(request.IdCuenta)).ConfigureAwait(false);
            var products = await productService.GetProduct().ConfigureAwait(false);

            if (requestOperation.Product.RDCode != 0)
            {
                ViewBag.SelectedProduct = requestOperation.Product.Id;
            }
            if (requestOperation.Operation.IdPeriodicity != null)
            {
                ViewBag.SelectedPeriodicity = requestOperation.Operation.IdPeriodicity;
            }

            CheckApplicantsInfo(request.Applicants, accountCustomers);

            ViewBag.Customers = request.Applicants.OrderBy(c => c.ApplicantRoleType.Id);
            ViewBag.Products = products.Where(p => p.ProductType.Id == ((int)ProductTypeMOEnum.Fund).ToString() && p.AdultMin == 100);
            ViewBag.SendPSD2 = sendPSD2;
            ViewBag.IsPSD2 = requestOperation.Operation.IdOperationType == (int)OperationTypeMOEnum.PeriodicSuscriptionPsd2;

            return PartialView("_PeriodicOperationDetailsView", model);
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

        [HttpPost]
        public async Task<ActionResult> InsertPeriodicOperation(UpdateRequestPeriodicOperationModel model)
        {
            //INSERTAR Request
            var request = new RequestData()
            {
                IdRequest = await operationsService.GenerateRequestId(model.Signer),
                RequestId = Guid.NewGuid(),
                RequestStartDate = DateTime.UtcNow,
                IdCuenta = model.AccountId.ToString(),
                IdSalesChannel = (int)SalesChannelType.Telefonico,
                IdRequestChannel = (int)RequestChannelType.MiddleOffice,
                Username = User.Identity.Name
            };
            var requestCreated = await signUpService.InsertRequest(request);
            //INSERTAR ESTADO 21
            var requestStatus = new RequestStatus()
            {
                IdRequest = request.RequestId,
                IdStatus = (int)RequestStatusEnum.Periodic_NotStarted,
                StartDate = DateTime.Now,
                Responsible = "Iniciada por Sistema",
                Comments = "Sistema"
            };
            var createStatus = await requestService.CreateOrUpdateStatus(requestStatus).ConfigureAwait(false);
            //INSERTAR RequestProductOperation
            var requestOperation = new RequestOperation()
            {
                Amount = null,
                IdOperationType = (int)OperationTypeMOEnum.PeriodicSuscription,
                IdWayToPay = (int)WayToPayType.Transferencia,
                MonthlyAmount = model.MonthlyAmount,
                IBAN = model.IBAN,
                InitialDay = model.InitialDay,
                InitialMonth = model.InitialMonth,
                InitialYear = model.InitialYear,
                IdPeriodicity = model.IdPeriodicity,
                ExternalCode = null
            };
            var requestProducOperation = new RequestProductOperation()
            {
                Product = new RequestProduct()
                {
                    Id = model.ProductId
                },
                Operation = requestOperation
            };
            await requestService.InsertRequestOperation(requestProducOperation, request.RequestId.Value);
            //INSERTAR ApplicantRole
            var accountCustomers = await portfoliosService.GetAccountData(model.AccountId).ConfigureAwait(false);
            var applicants = GetRequestApplicants(accountCustomers);
            foreach (var a in applicants)
            {
                await requestService.InsertApplicantRole(a, request.RequestId.Value);
            }
            return RedirectToAction("Index", "Details", new { requestID = request.RequestId.Value });
        }

        [HttpPost]
        public async Task<ActionResult> UpdatePeriodicOperation(UpdateRequestPeriodicOperationModel model)
        {
            if (await UpdateDataPeriodicOperation(model))
                AddCustomSuccess("Datos guardados correctamente");
            else
                AddCustomError("No se han podido guardar los datos");


            return RedirectToAction("Index", "Details", new { requestID = model.RequestId });
        }

        private async Task<bool> UpdateDataPeriodicOperation(UpdateRequestPeriodicOperationModel model)
        {
            var request = await requestService.GetRequest(model.RequestId).ConfigureAwait(false);
            var requestOperation = request.ProductOperations.FirstOrDefault(x => x.Operation.Id == model.Id);
            Decimal monthlyAmount = Convert.ToDecimal(model.MonthlyAmount, CultureInfo.InvariantCulture);
            requestOperation.Operation.MonthlyAmount = monthlyAmount;
            requestOperation.Operation.IBAN = model.IBAN;
            requestOperation.Operation.InitialDay = model.InitialDay;
            requestOperation.Operation.InitialMonth = model.InitialMonth;
            requestOperation.Operation.InitialYear = model.InitialYear;
            requestOperation.Operation.IdPeriodicity = model.IdPeriodicity;
            requestOperation.Operation.Transfer = null;
            request.ProductOperations.FirstOrDefault(po => po.Operation.Id == model.Id).Operation = requestOperation.Operation;

            foreach (var a in request.Applicants)
            {
                await requestService.UpdateApplicantRole(a, model.RequestId).ConfigureAwait(false);
            }
            var result = await requestService.UpdateOperation(requestOperation.Operation, model.RequestId).ConfigureAwait(false);
            return (result != null);
        }

        private List<RequestApplicant> GetRequestApplicants(List<AccountCustomer> accountCustomers)
        {
            var result = new List<RequestApplicant>();
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
                            SecondSurname = ac.Customer.Surname2
                        },
                        ApplicantRoleType = new ApplicantRole()
                        {
                            Id = role,
                            Description = ((ApplicantRoleType)role).ToString()
                        }
                    });
                }
            }
            return result;
        }

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



        #endregion
    }
}