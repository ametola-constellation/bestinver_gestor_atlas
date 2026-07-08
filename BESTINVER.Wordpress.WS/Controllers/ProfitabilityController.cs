using AutoMapper;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.Wordpress.WS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace BESTINVER.Wordpress.WS.Controllers
{
    /// <summary>
    /// Profitability API
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ProfitabilityController : Controller
    {
        private readonly IProductService productService;
        private readonly IMapper mapper;
        private readonly ILogger<ProfitabilityController> logger;
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="productService"></param>
        /// <param name="mapper"></param>
        /// <param name="logger"></param>
        /// <param name="configuration"></param>
        public ProfitabilityController(IProductService productService, IMapper mapper, ILogger<ProfitabilityController> logger, IConfiguration configuration)
        {
            this.productService = productService;
            this.mapper = mapper;
            this.logger = logger;
            this._configuration = configuration;
        }

        /// <summary>
        /// DownloadExcelLiquidity
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [Route("DownloadExcelLiquidity"), HttpGet]
        [ProducesResponseType(typeof(byte[]), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Moved)]
        public async Task<IActionResult> DownloadExcelLiquidity(int productId)
        {
            try
            {
                var productClass = GetClassId(productId);

                var product = await productService.GetProduct(productClass.productId);                

                byte[] productFile = await productService.GetProductAssetExcel((int)product.RDCode, productClass.classId).ConfigureAwait(false);
                if (productFile == null)
                {
                    return StatusCode((int)HttpStatusCode.Moved);
                }

                var fileName = product.Name.Trim().Replace(".", "_").Replace(",", "_");
             
                if (productClass.classId != null)
                {
                    var productWithClass = await productService.GetProductClass((int)product.RDCode, (int)productClass.classId);
                    fileName = productWithClass.Class;
                }
                
                return File(productFile,
                            $"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            $"Historico_Valores_Liquidativos_{fileName}.xlsx");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error ProfitabilityController-DownloadExcelLiquidity: {ex.Message}");
                return StatusCode((int)HttpStatusCode.Moved);
            }
        }

        /// <summary>
        /// MonthlyVL
        /// </summary>
        /// <param name="idProduct"></param>
        /// <param name="chartLegend"></param>
        /// <param name="countValues"></param>
        /// <returns></returns>
        [Route("MonthlyVL"), HttpGet]
        [ProducesResponseType(typeof(List<Dictionary<string, List<ChartTimeItem>>>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> MonthlyVL(int idProduct, string chartLegend, int countValues = 0)
        {
            try
            {
                if (idProduct == 0)
                {
                    return BadRequest("El parametro entrante idProduct no contine un valor válido");
                }

                if (string.IsNullOrEmpty(chartLegend))
                {
                    return BadRequest("El parámetro entrante chartLegend es nulo");
                }

                var product = await productService.GetProduct(idProduct);
                var productMonthlyAssetValue = await productService.GetProductMonthlyAssetValue((int)product.RDCode, countValues).ConfigureAwait(false);
                var orderedProductMonthlyAssetValue = productMonthlyAssetValue.OrderBy(iproductMonthlyAssetValue => iproductMonthlyAssetValue.ValuationDate).ToList();

                if (countValues > orderedProductMonthlyAssetValue.Count)
                    countValues = orderedProductMonthlyAssetValue.Count;

                if (countValues > 0)
                    orderedProductMonthlyAssetValue = orderedProductMonthlyAssetValue.GetRange(orderedProductMonthlyAssetValue.Count - countValues, countValues);

                var lChartTimeItem = new List<ChartTimeItem>();
                CultureInfo myCultInfo = new("es-ES");
                foreach (var i in orderedProductMonthlyAssetValue)
                {
                    string yValue = "";
                    try
                    {
                        if (i.NETvalue.HasValue)
                        {
                            yValue = Decimal.Round((decimal)i.NETvalue, 2).ToString(myCultInfo);
                        }
                    }
                    catch
                    {
                        yValue = i.NETvalue.ToString();
                    }
                    lChartTimeItem.Add(new ChartTimeItem(i.ValuationDate.ToString("MM/yyyy"), yValue));
                }

                Dictionary<string, List<ChartTimeItem>> returnData = new()
                {
                    { chartLegend, lChartTimeItem }
                };

                List<Dictionary<string, List<ChartTimeItem>>> lReturnData =
                [
                    returnData
                ];

                return Ok(lReturnData);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error ProfitabilityController-MonthlyVL: {ex.Message}");
                return BadRequest("Error en el servicio");
            }
        }

        /// <summary>
        /// AnnualProfitability
        /// </summary>
        /// <param name="idProduct"></param>
        /// <param name="chartLegend"></param>
        /// <param name="countValues"></param>
        /// <param name="showCurrentYear"></param>
        /// <returns></returns>
        [Route("AnnualProfitability"), HttpGet]
        [ProducesResponseType(typeof(List<Dictionary<string, List<ChartTimeItem>>>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> AnnualProfitability(int idProduct, string chartLegend, int countValues = 0, bool showCurrentYear = false)
        {
            try
            {
                if (idProduct == 0)
                {
                    return BadRequest("El parametro entrante idCartera no contine un valor válido");
                }
                if (string.IsNullOrEmpty(chartLegend))
                {
                    return BadRequest("El parámetro entrante chartLegend es nulo");
                }

                var product = await productService.GetProduct(idProduct);
                var productProfitabilityByPeriod = await productService.GetProductProfitabilityByPeriod((int)product.RDCode, "Y", null, null, countValues == 0, false, showCurrentYear).ConfigureAwait(false);
                var orderedProductProfitabilityByPeriod = productProfitabilityByPeriod.OrderBy(iProductProfitabilityByPeriod => iProductProfitabilityByPeriod.BeginDate).ToList();

                if (countValues > orderedProductProfitabilityByPeriod.Count)
                    countValues = orderedProductProfitabilityByPeriod.Count;

                if (countValues > 0)
                    orderedProductProfitabilityByPeriod = orderedProductProfitabilityByPeriod.GetRange(orderedProductProfitabilityByPeriod.Count - countValues, countValues);

                var lChartTimeItem = new List<ChartTimeItem>();
                CultureInfo myCultInfo = new("es-ES");
                foreach (var i in orderedProductProfitabilityByPeriod)
                {
                    lChartTimeItem.Add(new ChartTimeItem(i.Period, Decimal.Round(i.Profitability * 100, 2).ToString(myCultInfo)));
                }

                Dictionary<string, List<ChartTimeItem>> returnData = new()
                {
                    { chartLegend, lChartTimeItem }
                };

                List<Dictionary<string, List<ChartTimeItem>>> lReturnData =
                [
                    returnData
                ];

                return Ok(lReturnData);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error ProfitabilityController-AnnualProfitability: {ex.Message}");
                return BadRequest("Error en el servicio");
            }
        }

        /// <summary>
        /// MonthlyProfitability
        /// </summary>
        /// <param name="idProduct"></param>
        /// <param name="chartLegend"></param>
        /// <param name="countValues"></param>
        /// <returns></returns>
        [Route("MonthlyProfitability"), HttpGet]
        [ProducesResponseType(typeof(List<Dictionary<string, List<ChartTimeItem>>>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> MonthlyProfitability(int idProduct, string chartLegend, int countValues = 0)
        {
            try
            {
                if (idProduct == 0)
                {
                    return BadRequest("El parametro entrante idCartera no contine un valor válido");
                }
                if (string.IsNullOrEmpty(chartLegend))
                {
                    return BadRequest("El parámetro entrante chartLegend es nulo");
                }

                var product = await productService.GetProduct(idProduct);
                var productProfitabilityByPeriod = await productService.GetProductProfitabilityByPeriod((int)product.RDCode, "M", countValues, null, countValues == 0, false).ConfigureAwait(false);
                var orderedProductProfitabilityByPeriod = productProfitabilityByPeriod.OrderBy(iProductProfitabilityByPeriod => iProductProfitabilityByPeriod.BeginDate).ToList();

                if (countValues > orderedProductProfitabilityByPeriod.Count)
                    countValues = orderedProductProfitabilityByPeriod.Count;

                if (countValues > 0)
                    orderedProductProfitabilityByPeriod = orderedProductProfitabilityByPeriod.GetRange(orderedProductProfitabilityByPeriod.Count - countValues, countValues);

                var lChartTimeItem = new List<ChartTimeItem>();
                CultureInfo myCultInfo = new("es-ES");
                foreach (var i in orderedProductProfitabilityByPeriod)
                {
                    lChartTimeItem.Add(new ChartTimeItem(i.Period, Decimal.Round(i.Profitability * 100, 2).ToString(myCultInfo)));
                }

                Dictionary<string, List<ChartTimeItem>> returnData = new()
                {
                    { chartLegend, lChartTimeItem }
                };

                List<Dictionary<string, List<ChartTimeItem>>> lReturnData =
                [
                    returnData
                ];

                return Ok(lReturnData);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error ProfitabilityController-MonthlyProfitability: {ex.Message}");
                return BadRequest("Error en el servicio");
            }
        }

        /// <summary>
        /// LiquidityValuesByDate
        /// </summary>
        /// <param name="startDate"></param>
        /// <param name="productId"></param>
        /// <returns></returns>
        [Route("LiquidityValuesByDate"), HttpGet]
        [ProducesResponseType(typeof(List<LiquidityValuesByDateResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> LiquidityValuesByDate(DateTime startDate, int? productId)
        {
            try
            {
                var productProfitabilityDailyYtd = await productService.GetProfitabilityDailyYtd();
                var productFullList = await productService.GetProduct();
                var productConfigs = await productService.GetProductConfig();

               
                if (productId.HasValue)
                {
                    productFullList = productFullList.Where(p => p.MoProductId == productId.Value);
                }
                else
                {
                    productFullList = productFullList.Where(p => p.Marketable == null || p.Marketable == true);
                }

                foreach (var p in productProfitabilityDailyYtd)
                {
                    var iProduct = productFullList.FirstOrDefault(x => x.RDCode == p.ProductId);
                    var iProductoConfig = productConfigs.FirstOrDefault(x => x.RdCode == p.ProductId);
                    
                  
                    if (iProduct == null)
                    {
                        p.ProductId = 0;
                    }
                    else
                    {
                        p.NETValueYTD = (int)iProduct.MoProductId; // x.Code
                        p.ProductShortDesc = p.ProductDesc.Trim(); // x.Name
                        p.ProductType = iProduct.ProductType.Id; // x.FamiliaType
                        p.ProductDesc = iProduct.ProductType.Name; // x.FamiliaNombre
                        p.PreviousNETValue = iProduct.ProductType.OrderToShow; // x.FamiliaOrden
                        p.ProductTypeCode = iProductoConfig?.OrderToShowLiquidabilityValues?.ToString() ?? iProduct.OrderToShow.ToString(); // x.ProductOrder
                    }
                }

                if (productProfitabilityDailyYtd.Any(p => p.ProductId == 0))
                {
                    productProfitabilityDailyYtd = productProfitabilityDailyYtd.Where(p => p.ProductId != 0);
                }

                var allLiquidityProfitabilityDailyYtdResponse = mapper.Map<List<LiquidityValuesByDateResponse>>(productProfitabilityDailyYtd);

                var orderedAllLiquidityProfitabilityDailyYtdResponse = allLiquidityProfitabilityDailyYtdResponse.OrderBy(iAllLiquidityProfitabilityDailyYtdResponse => iAllLiquidityProfitabilityDailyYtdResponse.FamiliaOrden).ThenBy(iAllLiquidityProfitabilityDailyYtdResponse => iAllLiquidityProfitabilityDailyYtdResponse.ProductOrder).ToList();

                return Ok(orderedAllLiquidityProfitabilityDailyYtdResponse);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error ProfitabilityController-LiquidityValuesByDate: {ex.Message}");
                return BadRequest("Error en el servicio");
            }
        }

        ///// <summary>
        /////
        ///// </summary>
        ///// <param name="startDate"></param>
        ///// <param name="endDate"></param>
        ///// <param name="idProduct"></param>
        ///// <returns></returns>
        //[Route("ProfitabilityValuesByDates"), HttpGet]
        //public async Task<IActionResult> ProfitabilityValuesByDates(DateTime startDate, DateTime endDate, int idProduct)
        //{
        //    return Ok();
        //}

        /// <summary>
        /// CumulativeProfitability
        /// </summary>
        /// <param name="idProduct"></param>
        /// <param name="lang"></param>
        /// <param name="period"></param>
        /// <returns></returns>
        [Route("CumulativeProfitability"), HttpGet]
        [ProducesResponseType(typeof(List<CumulativeProfitabilityResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> CumulativeProfitability(int idProduct, string lang = "", string period = "")
        {
            try
            {
                if (idProduct == 0)
                {
                    return BadRequest("El parametro entrante idCartera no contine un valor válido");
                }

                var (productId, classId) = GetClassId(idProduct);

                var product = await productService.GetProduct(productId);
                var productProfitabilityByPeriod = await productService.GetProductProfitabilityByPeriod((int)product.RDCode, "F", null, null, true, false, classId: classId).ConfigureAwait(false);
                var orderedProductProfitabilityByPeriod = productProfitabilityByPeriod.OrderBy(iProductProfitabilityByPeriod => iProductProfitabilityByPeriod.Order).ToList();

                var returnData = new List<CumulativeProfitabilityResponse>();
                CultureInfo myCultInfo = new("es-ES");
                foreach (var i in orderedProductProfitabilityByPeriod)
                {
                    TextInfo myTI = myCultInfo.TextInfo;
                    returnData.Add(new CumulativeProfitabilityResponse(myTI.ToTitleCase(i.Period.ToLower()), Decimal.Round(i.Profitability * 100, 2).ToString(myCultInfo)));
                }

                if (string.IsNullOrEmpty(period))
                {
                    period = "inicio-Anio1-Anio3-Anio5-Anio10-Anio15-month6-current-last-LastLess2-LastLess3-LastLess4-LastLess5";
                }

                DateTime? ytdLastDate = null;
                var resultProductProfi = productProfitabilityByPeriod.FirstOrDefault(d => d.Period.Equals("YTD"));
                if (resultProductProfi != null)
                {
                    ytdLastDate = resultProductProfi.EndDate;
                }
                List<Period> values = period.Split('-').Select(v =>
                {
                    return GetPeriod(v, ytdLastDate);
                }).ToList();

                returnData = returnData.Where(i => values.Any(v => v.EsValue == i.Time)).ToList();

                returnData = returnData.Select(r =>
                {
                    if (string.IsNullOrEmpty(lang))
                    {
                        return new CumulativeProfitabilityResponse(r.Time, r.Profitability);
                    }
                    else
                    {
                        return new CumulativeProfitabilityResponse(values.FirstOrDefault(v => v.EsValue == r.Time).EnValue, r.Profitability);
                    }
                }).ToList();

                return Ok(returnData);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error ProfitabilityController-CumulativeProfitability: {ex.Message}");
                return BadRequest("Error en el servicio");
            }
        }

        /// <summary>
        /// AllLiquidityProfitabilityDateLastYear
        /// </summary>
        /// <returns></returns>
        [Route("AllLiquidityProfitabilityDateLastYear"), HttpGet]
        [ProducesResponseType(typeof(List<AllLiquidityProfitabilityDateLastYearResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> AllLiquidityProfitabilityDateLastYear()
        {
            try
            {
                var productProfitabilityDailyYtd = await productService.GetProfitabilityDailyYtd();
                var productFullList = await productService.GetProduct();
                foreach (var p in productProfitabilityDailyYtd)
                {
                    var iProduct = productFullList.FirstOrDefault(x => x.RDCode == p.ProductId);
                    if (iProduct == null)
                    {
                        p.ProductId = 0;
                    }
                    else
                    {
                        p.ProductId = (int)iProduct.MoProductId;
                        p.ProductShortDesc = iProduct.Name.Trim();
                    }
                }

                if (productProfitabilityDailyYtd.Any(p => p.ProductId == 0))
                {
                    productProfitabilityDailyYtd = productProfitabilityDailyYtd.Where(p => p.ProductId != 0);
                }

                var allLiquidityProfitabilityDailyYtdResponse = mapper.Map<List<AllLiquidityProfitabilityDateLastYearResponse>>(productProfitabilityDailyYtd);
                return Ok(allLiquidityProfitabilityDailyYtdResponse);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error ProfitabilityController-AllLiquidityProfitabilityDateLastYear: {ex.Message}");
                return BadRequest("Error en el servicio");
            }
        }

        /// <summary>
        /// ProductResumenProfitability
        /// </summary>
        /// <param name="idProduct"></param>
        /// <param name="chartLegend"></param>
        /// <param name="lang"></param>
        /// <param name="period"></param>
        /// <returns></returns>
        [Route("ProductResumenProfitability"), HttpGet]
        [ProducesResponseType(typeof(List<Dictionary<string, List<ChartTimeItem>>>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> ProductResumenProfitability(int idProduct, string chartLegend, string lang = "", string period = "")
        {
            try
            {
                if (idProduct == 0)
                {
                    return BadRequest("El parametro entrante idCartera no contine un valor válido");
                }
                if (string.IsNullOrEmpty(chartLegend))
                {
                    return BadRequest("El parámetro entrante chartLegend es nulo");
                }
                bool showCurrentYear = false;

                if (string.IsNullOrEmpty(period))
                {
                    period = "inicio-Anio1-Anio3-Anio5-Anio10-Anio15-month6-current-last-LastLess2-LastLess3-LastLess4-LastLess5";
                }

                var (productId, classId) = GetClassId(idProduct);

                showCurrentYear = period.ToLower().Contains("current");

                var product = await productService.GetProduct(productId);
                var productProfitabilityByPeriod = await productService.GetProductProfitabilityByPeriod((int)product.RDCode, "F", null, null, true, true, showCurrentYear, classId: classId).ConfigureAwait(false);
                var orderedProductProfitabilityByPeriod = productProfitabilityByPeriod.OrderBy(iProductProfitabilityByPeriod => iProductProfitabilityByPeriod.Order).ToList();

                DateTime? ytdLastDate = null;
                var resultProductProfi = productProfitabilityByPeriod.FirstOrDefault(d => d.Period.Equals("YTD", StringComparison.CurrentCultureIgnoreCase));
                if(resultProductProfi != null)
                {
                    ytdLastDate = resultProductProfi.EndDate;
                }

                List<Period> values = period.Split('-').Select(v =>
                {
                    return GetPeriod(v, ytdLastDate);
                }).ToList();

                var lChartTimeItem = new List<ChartTimeItem>();
                CultureInfo myCultInfo = new("es-ES");
                foreach (var i in orderedProductProfitabilityByPeriod)
                {
                    TextInfo myTI = myCultInfo.TextInfo;
                    lChartTimeItem.Add(i.Period.Equals("YTD", StringComparison.CurrentCultureIgnoreCase) ? new ChartTimeItem("YTD", Decimal.Round(i.Profitability * 100, 2).ToString(myCultInfo)): new ChartTimeItem(myTI.ToTitleCase(i.Period.ToLower()), Decimal.Round(i.Profitability * 100, 2).ToString(myCultInfo)));
                }

                lChartTimeItem = lChartTimeItem.Where(i => values.Any(v => v.EsValue.Equals(i.x))).ToList();

                lChartTimeItem = lChartTimeItem.Select(r =>
                {
                    if (string.IsNullOrEmpty(lang))
                    {
                        return new ChartTimeItem(r.x, r.y);
                    }
                    else
                    {
                        return new ChartTimeItem(values.FirstOrDefault(v => v.EsValue == r.x).EnValue, r.y);
                    }
                }).ToList();

                Dictionary<string, List<ChartTimeItem>> returnData = new()
                {
                    { chartLegend, lChartTimeItem }
                };

                List<Dictionary<string, List<ChartTimeItem>>> lReturnData =
                [
                    returnData
                ];

                return Ok(lReturnData);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error ProfitabilityController-ProductResumenProfitability: {ex.Message}");
                return BadRequest("Error en el servicio");
            }
        }

        private static Period GetPeriod(string p, DateTime? ytdLastDate)
        {
            var date = ytdLastDate != null ? ytdLastDate.Value : DateTime.UtcNow;
            Period result = null;
            switch (p.Trim().ToLower())
            {
                case "inicio":
                    result = new Period(p.Trim().ToLower(), "Inicio", "Inception");
                    break;
                case "anio1":
                    result = new Period(p.Trim().ToLower(), "1 Año", "1 year");
                    break;
                case "anio3":
                    result = new Period(p.Trim().ToLower(), "3 Años", "3 years");
                    break;
                case "anio5":
                    result = new Period(p.Trim().ToLower(), "5 Años", "5 years");
                    break;
                case "anio10":
                    result = new Period(p.Trim().ToLower(), "10 Años", "10 years");
                    break;
                case "anio15":
                    result = new Period(p.Trim().ToLower(), "15 Años", "15 years");
                    break;
                case "month6":
                    result = new Period(p.Trim().ToLower(), "6 Meses", "6 months");
                    break;
                case "current":
                    result = new Period(p.Trim().ToLower(), "YTD", "YTD");
                    break;
                case "last":
                    //result = new Period(p.Trim().ToLower(), DateTime.Now.AddYears(-1).Year.ToString(), DateTime.Now.AddYears(-1).Year.ToString());
                    result = new Period(p.Trim().ToLower(), date.AddYears(-1).Year.ToString(), date.AddYears(-1).Year.ToString());
                    break;
                case "lastless2":
                    //result = new Period(p.Trim().ToLower(), DateTime.Now.AddYears(-2).Year.ToString(), DateTime.Now.AddYears(-2).Year.ToString());
                    result = new Period(p.Trim().ToLower(), date.AddYears(-2).Year.ToString(), date.AddYears(-2).Year.ToString());
                    break;
                case "lastless3":
                    //result = new Period(p.Trim().ToLower(), DateTime.Now.AddYears(-3).Year.ToString(), DateTime.Now.AddYears(-3).Year.ToString());
                    result = new Period(p.Trim().ToLower(), date.AddYears(-3).Year.ToString(), date.AddYears(-3).Year.ToString());
                    break;
                case "lastless4":
                    //result = new Period(p.Trim().ToLower(), DateTime.Now.AddYears(-4).Year.ToString(), DateTime.Now.AddYears(-4).Year.ToString());
                    result = new Period(p.Trim().ToLower(), date.AddYears(-4).Year.ToString(), date.AddYears(-4).Year.ToString());
                    break;
                case "lastless5":
                    //result = new Period(p.Trim().ToLower(), DateTime.Now.AddYears(-5).Year.ToString(), DateTime.Now.AddYears(-5).Year.ToString());
                    result = new Period(p.Trim().ToLower(), date.AddYears(-5).Year.ToString(), date.AddYears(-5).Year.ToString());
                    break;
            }
            return result;
        }

        private (int productId, int? classId) GetClassId(int productId)
        {
            string propertyClassId = string.Empty;
            int? classId = null;
            _configuration.GetSection("MasterProductClasses").GetChildren().ToDictionary(x => x.Key, x => x.Value).TryGetValue(productId.ToString(), out propertyClassId);
            if (!string.IsNullOrWhiteSpace(propertyClassId))
            {
                productId = Int32.Parse(propertyClassId.Split("-")[0]);
                classId = (int?)(Int32.Parse(propertyClassId.Split("-")[1]));
            }

            return (productId, classId);
        }

    }
}