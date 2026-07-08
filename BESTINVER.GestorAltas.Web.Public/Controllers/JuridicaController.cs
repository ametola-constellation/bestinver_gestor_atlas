using BestInver.Core.Otel.Metrics;
using BestInver.WebPrivada.Shared.Models.Microservices.Products.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.MicroservicesProxy.Exceptions;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Models.Applicants;
using BESTINVER.GestorAltas.Web.Public.Models;
using BESTINVER.GestorAltas.Web.Public.Models.Register;
using BESTINVER.GestorAltas.Web.Public.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Public.Controllers
{
    public class JuridicaController : RegisterController
    {
        public JuridicaController(
            IProductService productService,
            IOptions<AppSettings> appSettings,
            IRegisterService registerService,
            ISignUpService signUpService,
            AutoMapper.IMapper mapper,
            ISendMailService sendMailService,
            IApplicantService applicantService,
            IRequestService requestService,
            ITestService testService,
            ILogger<JuridicaController> logger,
            IProspectService prospectService,
            ICallLimitingService callLimitingService
            ) : base(
                productService,
                appSettings,
                registerService,
                signUpService,
                mapper,
                sendMailService,
                applicantService,
                requestService,
                testService,
                logger,
                prospectService,
                callLimitingService)
        {
        }

        public override async Task<ActionResult> Index(string id, [FromQuery(Name = "Modal")] string modal)
        {
            bool juridicOnlyInAssisted = appSettings.Value.IsJuridicOnlyInAssistMode;
            if (juridicOnlyInAssisted && !User.Identity.IsAuthenticated)
                return RedirectToAction("Index", "Register");

            var types = (await productService.GetProductTypes().ConfigureAwait(false)).OrderBy(p => p.OrderToShow).Where(t => t.Id != ((int)ProductTypeMOEnum.Asesoramiento).ToString());
            var products = (await productService.GetProduct().ConfigureAwait(false)).Where(p => p.Show.Value).OrderBy(o => o.OrderToShow);
            var productsConfig = await productService.GetProductConfig().ConfigureAwait(false);

            foreach (var product in products)
                product.OrderToShow = productsConfig.FirstOrDefault(config => config.RdCode == product.Id)?.OrderToShowNewInvestor ?? product.OrderToShow;

            products = products.OrderBy(p => p.OrderToShow);

            var profitability = (await productService.GetProfitabilityDailyYtd().ConfigureAwait(false));
            var profitabilitydate = profitability.FirstOrDefault(p => p.ProductId != 100196).ValuationDate;
            var profitabilitydateFIL = profitability.FirstOrDefault(p => p.ProductId == 100196).ValuationDate;

            PersonalDataViewModel model = new PersonalDataViewModel
            {
                Products = mapper.Map<List<ProductModel>>(products),
                ProductTypes = mapper.Map<List<ProductTypeModel>>(types),
                ProfitabilityDisclaimer = string.Format(new CultureInfo("es-ES"), appSettings.Value.ProductProfitabilityDisclaimer),
                ProfitabilityDate = $"Datos a fecha: {profitabilitydate.ToString("d", new CultureInfo("es-ES"))}"
            };

            if (User.Identity.IsAuthenticated)
            {
                model.ProductTypes = model.ProductTypes.Where(p => p.Id != 1 && p.Id != 4).ToList();
                model.ProfitabilityDateFIL = $"Fecha valor liquidativo Hedge Value Fund: {profitabilitydateFIL.ToString("d", new CultureInfo("es-ES"))}";
            }
            else
            {
                model.ProductTypes = model.ProductTypes.Where(p => p.Id == 2).ToList();
            }

            if (!String.IsNullOrEmpty(id))
            {
                int n;
                bool isNumeric = int.TryParse(id, out n);

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

            return View("Index", model);
        }

        public override async Task<ActionResult> PersonalDataView(string id, [FromQuery(Name = "Modal")] string modal)
        {
            bool juridicOnlyInAssisted = appSettings.Value.IsJuridicOnlyInAssistMode;
            if (juridicOnlyInAssisted && !User.Identity.IsAuthenticated)
                return RedirectToAction("Index", "Register");

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
                ProfitabilityDisclaimer = string.Format(new CultureInfo("es-ES"), appSettings.Value.ProductProfitabilityDisclaimer),
                MasterData = mapper.Map<MasterDataModel>(master),
                SessionTimeout = appSettings.Value.TimeOut,
                LogRocketAccount = appSettings.Value.LogRocketAccount,
                LogRocketEnabled = appSettings.Value.LogRocketEnabled
            };

            if (User.Identity.IsAuthenticated)
            {
                var username = User.Identity.Name;
                var mail = User.Claims.Single(c => c.Type == ClaimTypes.Email)?.Value;
                model.UserName = username;
                model.UserMail = mail;
                model.ProductTypes = model.ProductTypes.Where(p => p.Id != 1 && p.Id != 4).ToList();
            }
            else
            {
                model.ProductTypes = model.ProductTypes.Where(p => p.Id == 2).ToList();
            }

            if (!String.IsNullOrEmpty(id))
            {
                try
                {
                    string querystring = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(id));
                    var queryDictionary = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(querystring);
                    string _id = queryDictionary.FirstOrDefault(q => q.Key == "ProductId").Value;
                    string _typeid = model.Products.Find(p => p.Id.ToString() == _id).ProductTypeId.ToString();

                    model.ProductID = _id;
                    model.ProductTypeID = _typeid.ToString();
                    model.Product = model.Products.Where(p => p.Id.ToString() == _id).FirstOrDefault();
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
        public override async Task<IActionResult> SaveSignatureData([FromBody] DocumentGroupData model)
        {
            try
            {
                model.GenerateDoc = false;
                return await base.SaveSignatureData(model);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error en SaveSignatureData para RequestId: {RequestId}", model.RequestId);
                throw;
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public override async Task<IActionResult> SaveDniData([FromBody] DNIData model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }

                var result = await registerService.SaveJuridicDocuments(model).ConfigureAwait(false);
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
        public async Task<IActionResult> AskForRequiredRealOwner([FromBody] RequestRequiredRealOwner model)
        {
            try
            {
                var result = await testService.AskForRequiredRealOwner(model).ConfigureAwait(false);
                return Ok(result);
            }
            catch
            {
                return Ok(false);
            }
        }

        public override async Task<IActionResult> RecoverySignature(string id)
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

                return View("RecoverySignature", model);
            }
            else
            {
                return RedirectToAction("Error", "NotFoundError");
            }
        }

    }
}