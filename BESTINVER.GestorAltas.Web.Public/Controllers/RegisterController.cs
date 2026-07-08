using AutoMapper;
using BestInver.Core.Otel.Metrics;
using BestInver.WebPrivada.Shared.Models.Microservices.Products.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Request;
using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.Exceptions;
using BESTINVER.GestorAltas.MicroservicesProxy.Exceptions;
using BESTINVER.GestorAltas.MicroservicesProxy.Models;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Models;
using BESTINVER.GestorAltas.Web.Models.Applicants;
using BESTINVER.GestorAltas.Web.Models.Requests;
using BESTINVER.GestorAltas.Web.Public.Extensions;
using BESTINVER.GestorAltas.Web.Public.Helpers;
using BESTINVER.GestorAltas.Web.Public.Models;
using BESTINVER.GestorAltas.Web.Public.Models.Register;
using BESTINVER.GestorAltas.Web.Public.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Public.Controllers
{
    public class RegisterController : Controller
    {
        protected readonly IProductService productService;
        protected readonly IOptions<AppSettings> appSettings;
        protected readonly IRegisterService registerService;
        protected readonly ISignUpService signUpService;
        protected readonly IMapper mapper;
        protected readonly ISendMailService sendMailService;
        protected readonly IApplicantService applicantService;
        protected readonly IRequestService requestService;
        protected readonly ITestService testService;
        protected readonly ILogger<RegisterController> logger;
        protected readonly IProspectService prospectService;
        protected readonly ICallLimitingService callLimitingService;

        public RegisterController(
            IProductService productService,
            IOptions<AppSettings> appSettings,
            IRegisterService registerService,
            ISignUpService signUpService,
            IMapper mapper,
            ISendMailService sendMailService,
            IApplicantService applicantService,
            IRequestService requestService,
            ITestService testService,
            ILogger<RegisterController> logger,
            IProspectService prospectService,
            ICallLimitingService callLimitingService)
        {
            this.productService = productService;
            this.appSettings = appSettings;
            this.registerService = registerService;
            this.signUpService = signUpService;
            this.mapper = mapper;
            this.sendMailService = sendMailService;
            this.applicantService = applicantService;
            this.requestService = requestService;
            this.testService = testService;
            this.logger = logger;
            this.prospectService = prospectService;
            this.callLimitingService = callLimitingService;
        }

        public virtual async Task<ActionResult> Index(string id, [FromQuery(Name = "Modal")] string modal)
        {
            var types = (await productService.GetProductTypes().ConfigureAwait(false)).OrderBy(p => p.OrderToShow);

            var products = (await productService.GetProduct().ConfigureAwait(false)).Where(p => p.Show.Value);

            var productsConfig = await productService.GetProductConfig().ConfigureAwait(false);

            foreach (var product in products)
                product.OrderToShow = productsConfig.FirstOrDefault(config => config.RdCode == product.Id)?.OrderToShowNewInvestor ?? product.OrderToShow;

            products = products.OrderBy(p => p.OrderToShow);

            PersonalDataViewModel model = new PersonalDataViewModel
            {
                Products = mapper.Map<List<ProductModel>>(products),
                ProductTypes = mapper.Map<List<ProductTypeModel>>(types),
                ProfitabilityDisclaimer = string.Format(new CultureInfo("es-ES"), appSettings.Value.ProductProfitabilityDisclaimer),
                ProfitabilityDate = "",
                ProfitabilityDateFIL = ""
            };

            if (!User.Identity.IsAuthenticated)
            {
                model.ProductTypes = model.ProductTypes.Where(t => t.Id != 3).OrderBy(p => p.OrderToShow).ToList();
                model.Products = model.Products.Where(
                    p => p.Id != (int)ProductNames.BESTVALUE
                    && p.Id != (int)ProductNames.BESTINVER_INFRA
                    && p.Id != (int)ProductNames.BESTINVER_PRIVATE_EQUITY
                    && p.Id != (int)ProductNames.BESTINVER_INFRA_II
                    && p.ProductTypeId != (int)ProductTypeMOEnum.Asesoramiento
                ).OrderBy(p => p.OrderToShow).ToList();
                model.ProfitabilityDateFIL = "";
            }

            if (!string.IsNullOrEmpty(id))
            {
                bool isNumeric = int.TryParse(id, out int n);

                if (!isNumeric)
                {
                    RouteData.Values.Remove("id");
                    return RedirectToAction("Index");
                }
                else
                {
                    model.ProductTypePredef = id;
                }
            }

            model.Modal = !string.IsNullOrEmpty(modal) ? "S" : "N";
            model.IsMobile = HttpContext.Request.Headers["User-Agent"].ToString().Contains("MOBI", StringComparison.CurrentCultureIgnoreCase);
            model.utm_medium = HttpContext.Request.Cookies.FirstOrDefault(c => c.Key == "_medium").Value;
            model.utm_source = HttpContext.Request.Cookies.FirstOrDefault(c => c.Key == "_source").Value;
            model.utm_campaign = HttpContext.Request.Cookies.FirstOrDefault(c => c.Key == "_campaign").Value;
            model.utm_content = HttpContext.Request.Cookies.FirstOrDefault(c => c.Key == "_content").Value;
            model.utm_term = HttpContext.Request.Cookies.FirstOrDefault(c => c.Key == "_term").Value;

            return View("Index", model);
        }

        [Authorize]
        public virtual ActionResult Login(string id)
        {
            return RedirectToAction("Index");
        }

        [Authorize, AllowAnonymous]
        public virtual async Task<ActionResult> PersonalDataView(string id, [FromQuery(Name = "Modal")] string modal)
        {
            var productTypesTask = productService.GetProductTypes();
            var productsTask = productService.GetProduct();
            var masterDataTask = signUpService.GetMasterdata();

            await Task.WhenAll(productTypesTask, productsTask, masterDataTask).ConfigureAwait(false);

            var types = (await productTypesTask).OrderBy(p => p.OrderToShow);
            var products = (await productsTask).Where(p => p.Show.Value).OrderBy(o => o.OrderToShow);
            var master = await masterDataTask;

            PersonalDataViewModel model = new PersonalDataViewModel
            {
                Products = mapper.Map<List<ProductModel>>(products),
                ProductTypes = mapper.Map<List<ProductTypeModel>>(types),
                MasterData = mapper.Map<MasterDataModel>(master),
                SessionTimeout = appSettings.Value.TimeOut,
                LogRocketAccount = appSettings.Value.LogRocketAccount,
                LogRocketEnabled = appSettings.Value.LogRocketEnabled,
            };

            if (User.Identity.IsAuthenticated)
            {
                var username = User.Identity.Name;
                var mail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
                model.UserName = username;
                model.UserMail = mail;
            }

            if (!string.IsNullOrEmpty(id))
            {
                try
                {
                    string querystring = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(id));
                    var queryDictionary = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(querystring);
                    string _id = queryDictionary.FirstOrDefault(q => q.Key == "ProductId").Value;
                    string _typeid = model.Products.Find(p => p.Id.ToString() == _id).ProductTypeId.ToString();

                    model.ProductID = _id;
                    model.ProductTypeID = _typeid;
                    model.Product = model.Products.Find(p => p.Id.ToString() == _id);
                }
                catch (Exception)
                {
                    RouteData.Values.Remove("id");
                    return RedirectToAction("Index");
                }
            }

            model.Modal = !string.IsNullOrEmpty(modal) ? "S" : "N";

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SaveApplicantBasicData([FromBody] BESTINVER.GestorAltas.Web.Models.ApplicantBasicData model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }
                model.IdRequestChannel = (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.RequestChannelType.Publica;

                var applicant = mapper.Map<SignUpApplicant>(model);
                var request = mapper.Map<RequestData>(model);

                var result = await registerService.SaveBasicData(applicant, request).ConfigureAwait(false);

                return Ok(result);
            }
            catch (RDConflictException ex)
            {
                return StatusCode((int)HttpStatusCode.MethodNotAllowed, ex.GetBaseException().Message);
            }
            catch (RequestForbiddenException ex)
            {
                return StatusCode((int)HttpStatusCode.Forbidden, ex.GetBaseException().Message);
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode((int)HttpStatusCode.Conflict, ex.GetBaseException().Message);
            }
            catch (RDConnectionException ex)
            {
                return StatusCode((int)HttpStatusCode.BadGateway, ex.GetBaseException().Message);
            }
            catch (SaveBasicDataException ex)
            {
                return StatusCode((int)HttpStatusCode.BadRequest, ex.GetBaseException().Message);
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public virtual async Task<IActionResult> SaveRequestData([FromBody] RegisterData model)
        {
            try
            {
                var requestData = mapper.Map<RequestFullData>(model);
                var result = await registerService.SaveRequestFullData(requestData).ConfigureAwait(false);

                BestInverBusinessMetrics.IncreaseRegistrations();
                BestInverBusinessMetrics.IncreaseKnowledgeTestStorage($"{HttpContext.Request.PathBase}{HttpContext.Request.Path}");
                BestInverBusinessMetrics.IncreaseConvenienceTestStorage($"{HttpContext.Request.PathBase}{HttpContext.Request.Path}");

                return Ok(result);
            }
            catch (RDConflictException ex)
            {
                return StatusCode((int)HttpStatusCode.MethodNotAllowed, ex.GetBaseException().Message);
            }
            catch (RequestForbiddenException ex)
            {
                return StatusCode((int)HttpStatusCode.Forbidden, ex.GetBaseException().Message);
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode((int)HttpStatusCode.Conflict, ex.GetBaseException().Message);
            }
            catch (RDConnectionException ex)
            {
                return StatusCode((int)HttpStatusCode.BadGateway, ex.GetBaseException().Message);
            }
            catch (BlockSignatureException ex)
            {
                return StatusCode((int)HttpStatusCode.Locked, ex.GetBaseException().Message);
            }
            catch (AccountException ex)
            {
                return StatusCode((int)HttpStatusCode.UnavailableForLegalReasons, ex.GetBaseException().Message);
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public virtual async Task<IActionResult> SaveSignatureData([FromBody] DocumentGroupData model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }

                // Crear clave única para este RequestId y comprobar si la petición está permitida.
                var callLimitKey = $"SaveSignature_{model.RequestId}";
                var isAllowed = await callLimitingService.IsRequestAllowedAsync(callLimitKey, TimeSpan.FromMinutes(10));

                if (!isAllowed)
                {
                    logger.LogWarning("Intento de múltiples llamadas bloqueado para RequestId: {RequestId}", model.RequestId);
                    return StatusCode((int)HttpStatusCode.TooManyRequests, "El proceso de firma ya ha sido iniciado.");
                }

                if (model.IdDocumentSignatureType == 1)
                {
                    List<Task> tasks = new List<Task>();
                    model.IdSendingWay = (int)SendingWayType.FirmaOnline;

                    if (model.MobilePhoneByApplicant != null)
                    {
                        foreach (var mb in model.MobilePhoneByApplicant)
                        {
                            if (!mb.IsMobilePhoneOk)
                            {
                                var app = await applicantService.GetApplicantByDNI(mb.ApplicantId.Trim()).ConfigureAwait(false);
                                app.BasicData.MobilePhoneNumber = mb.MobilePhone;
                                tasks.Add(applicantService.Update(app));
                            }
                        }
                        await Task.WhenAll(tasks).ConfigureAwait(false);
                    }
                }

                var requestData = mapper.Map<RequestFullData>(model);
                var ecerticDocs = await registerService.SaveSignatureData(requestData, model.GenerateDoc).ConfigureAwait(false);
                var result = ecerticDocs.GetEcerticDocumentList(Url.Action("openfile", "shared"), appSettings.Value.Aes256Key);
                return Ok(result);
            }
            catch (RDConflictException ex)
            {
                return StatusCode((int)HttpStatusCode.MethodNotAllowed, ex.GetBaseException().Message);
            }
            catch (RequestForbiddenException ex)
            {
                return StatusCode((int)HttpStatusCode.Forbidden, ex.GetBaseException().Message);
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode((int)HttpStatusCode.Conflict, ex.GetBaseException().Message);
            }
            catch (RDConnectionException ex)
            {
                return StatusCode((int)HttpStatusCode.BadGateway, ex.GetBaseException().Message);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error en SaveSignatureData para RequestId: {RequestId}", model.RequestId);
                throw;
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public virtual async Task<IActionResult> SaveDniData([FromBody] DNIData model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }

                var result = await registerService.SaveDni(model).ConfigureAwait(false);
                BestInverBusinessMetrics.IncreaseDNIStorage($"{HttpContext.Request.PathBase}{HttpContext.Request.Path}");
                return Ok(result);
            }
            catch (RDConflictException ex)
            {
                return StatusCode((int)HttpStatusCode.MethodNotAllowed, ex.GetBaseException().Message);
            }
            catch (RequestForbiddenException ex)
            {
                return StatusCode((int)HttpStatusCode.Forbidden, ex.GetBaseException().Message);
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode((int)HttpStatusCode.Conflict, ex.GetBaseException().Message);
            }
            catch (RDConnectionException ex)
            {
                return StatusCode((int)HttpStatusCode.BadGateway, ex.GetBaseException().Message);
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CompleteProcess([FromBody] CompleteProcessModel model)
        {
            await registerService.CompleteProccess(new Guid(model.RequestId)).ConfigureAwait(false);
            return Ok(true);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> MoveToNextStatus([FromBody] ChangeRequestStatusModel model)
        {
            model.NoRestrictions = false;
            model.Responsible = "Sistema";

            var response = await registerService.ChangeRequestStatus(model);

            return Ok(response.StatusList.Any());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SetApplicantGDPR([FromBody] GDPRApplicantAcceptationModel model)
        {
            try
            {
                var applicant = await applicantService.GetApplicantByDNI(model.DNI).ConfigureAwait(false);
                applicant.BasicData.Gdpr = model.GDPR1;
                applicant.BasicData.GdprEvents = model.GDPR2;
                applicant.BasicData.GdprGroup = model.GDPR3;
                applicant.BasicData.GdprDate = DateTime.UtcNow;
                applicant.BasicData.GdprEventsDate = DateTime.UtcNow;
                applicant.BasicData.GdprGroupDate = DateTime.UtcNow;
                await prospectService.UpdateConsentModal(applicant.BasicData);
                await applicantService.Update(applicant);

                return Json(new
                {
                    data = true
                });
            }
            catch
            {
                return Json(new
                {
                    data = false
                });
            }
        }

        public virtual async Task<IActionResult> RecoverySignature(string id)
        {
            SignatureRestoreDataViewModel model = new SignatureRestoreDataViewModel();
            if (!String.IsNullOrEmpty(id))
            {
                var master = await signUpService.GetMasterdata().ConfigureAwait(false);

                string querystring = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(id));
                var queryDictionary = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(querystring);
                string _dni = queryDictionary.FirstOrDefault(q => q.Key == "Dni").Value;
                string _requestId = queryDictionary.FirstOrDefault(q => q.Key == "RequestId").Value;

                model.Dni = _dni;
                model.RequestId = _requestId;
                model.SessionTimeout = appSettings.Value.TimeOut;
                model.IsMobile = HttpContext.Request.Headers["User-Agent"].ToString().Contains("MOBI", StringComparison.CurrentCultureIgnoreCase);
                model.MasterData = mapper.Map<MasterDataModel>(master);
                model.LogRocketAccount = appSettings.Value.LogRocketAccount;
                model.LogRocketEnabled = appSettings.Value.LogRocketEnabled;

                var request = await requestService.GetRequest(new Guid(model.RequestId)).ConfigureAwait(false);
                bool juridica = request.Applicants.Any(a => a.Applicant.ApplicantType.Id == (int)PersonTypeEnum.Juridica);
                bool isforeign = request.Applicants.FirstOrDefault(a => a.Applicant.DNI == _dni)?.Applicant.IDDocumentType == "PAS";

                if (juridica) { return RedirectToAction("RecoverySignature", "Juridica", new { id = id }); }
                if (isforeign) { return RedirectToAction("RecoverySignature", "Extranjero", new { id = id }); }

                model.IsAsesoramiento = request.Product.ProductType.Id == (int)ProductTypeMOEnum.Asesoramiento;

                return View("RecoverySignature", model);
            }
            else
            {
                return RedirectToAction("Error", "NotFoundError");
            }
        }

        public async Task<IActionResult> SendDocument(string id)
        {
            SignatureRestoreDataViewModel model = new SignatureRestoreDataViewModel();
            if (!String.IsNullOrEmpty(id))
            {
                var master = await signUpService.GetMasterdata().ConfigureAwait(false);

                string querystring = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(id));
                var queryDictionary = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(querystring);

                string _dni = queryDictionary.FirstOrDefault(q => q.Key == "Dni").Value;
                string _requesid = queryDictionary.FirstOrDefault(q => q.Key == "RequestId").Value;
                string _completename = queryDictionary.FirstOrDefault(q => q.Key == "CompleteName").Value;
                string _birthday = queryDictionary.FirstOrDefault(q => q.Key == "Birthday").Value;

                bool _isminor;
                Boolean.TryParse(queryDictionary.FirstOrDefault(q => q.Key == "Minor").Value, out _isminor);
                model.Dni = _dni;
                model.RequestId = _requesid;
                model.CompleteName = _completename;
                model.IsMinor = _isminor;
                model.SessionTimeout = appSettings.Value.TimeOut;
                model.Birthday = DateTime.ParseExact(_birthday, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                model.MasterData = mapper.Map<MasterDataModel>(master);
                model.LogRocketAccount = appSettings.Value.LogRocketAccount;
                model.LogRocketEnabled = appSettings.Value.LogRocketEnabled;

                return View("SendDocument", model);
            }
            else
            {
                return RedirectToAction("Error", "NotFoundError");
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RestoreSignatureProcess([FromBody] SignatureRestoreDataViewModel model)
        {
            var result = await registerService.RestoreDocumentsSignature(model).ConfigureAwait(false);
            if (result != null)
            {
                result.DocumentList = PublicUrlHelper.GetPublicUrlDownloadDocuments(result.DocumentList, Url.Action("openfile", "shared"), appSettings.Value.Aes256Key);
            }

            return Ok(result);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendDocumentProcess([FromBody] SignatureRestoreDataViewModel model)
        {
            var result = await registerService.RestoreDocumentUpdate(model).ConfigureAwait(false);
            if (result != null)
            {
                result.DocumentList = PublicUrlHelper.GetPublicUrlDownloadDocuments(result.DocumentList, Url.Action("openfile", "shared"), appSettings.Value.Aes256Key);
            }
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> SetApplicantSignDate(Guid requestId, string dni)
        {
            try
            {
                await registerService.SetApplicantSignDate(requestId, dni).ConfigureAwait(false);
                BestInverBusinessMetrics.IncreaseClientSignedDocumentation($"{HttpContext.Request.PathBase}{HttpContext.Request.Path}");
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> CheckConvenienceExistingApplicant(string dni, int productId)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                else
                {
                    var response = await registerService.CheckExistingApplicantData(dni, productId).ConfigureAwait(false);
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "RegisterController-CheckConvenienceExistingApplicant, error: {Message}", ex.Message);
                return StatusCode((int)System.Net.HttpStatusCode.InternalServerError, ex.GetBaseException().Message);
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CheckConvenience([FromBody] CheckConvenienceData model)
        {
            var convenientProductRequest = mapper.Map<ConvenienceRequest>(model);
            var result = await testService.checkconvenience(convenientProductRequest).ConfigureAwait(false);
            return Ok(result.IsConvenientProduct);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendHelpMail([FromBody] string phone)
        {
            try
            {
                var result = await sendMailService.SendCallMeBackMail(phone, new RequestChannel
                {
                    Id = (int)RequestChannelType.Publica
                }).ConfigureAwait(false);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet]
        public async Task<IActionResult> LegalModalContent()
        {
            try
            {
                var result = await registerService.GetLegalModalContent().ConfigureAwait(false);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Endpoint para mantener la sesión activa durante el proceso de alta
        /// </summary>
        [HttpPost]
        public IActionResult KeepSessionAlive()
        {
            try
            {
                var sessionId = HttpContext.Session.Id;

                // Acceder a la sesión para renovarla automáticamente
                // Establecemos o actualizamos un valor en la sesión para forzar su renovación
                var lastActivityKey = "LastActivity";
                var currentTime = DateTime.UtcNow;

                // Escribir en la sesión para activar el mecanismo de renovación
                HttpContext.Session.SetString(lastActivityKey, currentTime.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"));

                // También podemos leer un valor existente para asegurar que la sesión se accede
                var existingValue = HttpContext.Session.GetString(lastActivityKey);

                return Ok(new
                {
                    success = true,
                    sessionId = sessionId,
                    timestamp = currentTime,
                    lastActivity = existingValue
                });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error en KeepSessionAlive");
                return Ok(new
                {
                    success = false,
                    error = "Session error"
                });
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}