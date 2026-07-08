using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Carteras;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.Wordpress.WS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net;
using System.Threading.Tasks;
using System.Linq;
using System.Collections;

namespace BESTINVER.Wordpress.WS.Controllers
{
    /// <summary>
    /// Carteras API
    /// </summary>
    [Route("api/Carteras")]
    [ApiController]
    public class CarterasController : Controller
    {
        private readonly ICarteraService carteraService;
        private readonly IMapper mapper;
        private readonly ILogger<CarterasController> logger;

        /// <summary>
        /// Cconstructor
        /// </summary>
        /// <param name="carteraService"></param>
        /// <param name="mapper"></param>
        /// <param name="logger"></param> 
        public CarterasController(ICarteraService carteraService, IMapper mapper, ILogger<CarterasController> logger)
        {
            this.carteraService = carteraService;
            this.mapper = mapper;
            this.logger = logger;
        }

        /// <summary>
        /// Get top carteras
        /// </summary>
        /// <param name="idCartera"></param>
        /// <param name="sector"></param>
        /// <param name="numberOfResults"></param>
        /// <returns></returns>
        [Route("TopPositions"), HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> TopPositions(int idCartera, string sector = "", int numberOfResults = 3)
        {
            try
            {
                if (String.IsNullOrEmpty(sector))
                {
                    var data = await carteraService.GetCarterasTopPositions(idCartera).ConfigureAwait(false);
                    var result = mapper.Map<List<CarteraPositionBySectorModel>>(data);
                    return Ok(result);
                }
                else
                {
                    NumberStyles numberStyle = NumberStyles.AllowDecimalPoint;
                    CultureInfo myCultInfo = new CultureInfo("es-ES");

                    var data = await carteraService.GetCarterasTopPositions(idCartera, sector, numberOfResults).ConfigureAwait(false);

                    Dictionary<string, string> returnValue = new Dictionary<string, string>();
                    foreach (CarteraPositionBySector c in data)
                    {
                        string key = string.Empty;
                        string value = string.Empty;
                        decimal d = 0;

                        foreach (var p in c.InstrumentPositions.OrderByDescending(o => o.Diversificacion).ThenBy(o => o.NombreInstrumento))
                        {
                            key = p.NombreInstrumento;

                            if (decimal.TryParse(p.Diversificacion.Replace(".", ","), numberStyle, myCultInfo, out d))
                            {
                                value = Decimal.Round(d, 2).ToString(myCultInfo);
                            }

                            returnValue.Add(key, value);
                        }
                    }

                    List<Dictionary<string, string>> lReturnValue = new List<Dictionary<string, string>>
                    {
                        returnValue
                    };

                    return Ok(lReturnValue);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error CarterasController-TopPositions: {ex.Message}");
                return BadRequest("Error en el servicio");
            }
        }

        /// <summary>
        /// Get cartera grouped by sector
        /// </summary>
        /// <param name="idCartera"></param>
        /// <returns></returns>
        [Route("SectoralDistribution"), HttpGet]
        [ProducesResponseType(typeof(List<Dictionary<string, string>>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> SectoralDistribution(int idCartera)
        {
            try
            {
                var data = await carteraService.GetSectoralDistribution(idCartera).ConfigureAwait(false);
                
                var returnData = new Dictionary<string, string>();
                foreach (var i in data)
                {
                    returnData.Add(i.Key, i.Value);
                    
                }

                List<Dictionary<string, string>> lReturnData = new List<Dictionary<string, string>>
                {
                    returnData
                };

                return Ok(lReturnData);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error CarterasController-SectoralDistribution: {ex.Message}");
                return BadRequest("Error en el servicio");
            }
        }

        /// <summary>
        /// Get cartera grouped by geographical location
        /// </summary>
        /// <param name="idCartera"></param>
        /// <returns></returns>
        [Route("GeographicalDistribution"), HttpGet]
        [ProducesResponseType(typeof(List<Dictionary<string, string>>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> GeographicalDistribution(int idCartera)
        {
            try
            {
                var data = await carteraService.GetGeographicalDistribution(idCartera).ConfigureAwait(false);
                
                var returnData = new Dictionary<string, string>();
                foreach (var i in data)
                {
                    returnData.Add(i.Key, i.Value);
                }

                List<Dictionary<string, string>> lReturnData = new List<Dictionary<string, string>>
                {
                    returnData
                };

                return Ok(lReturnData);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error CarterasController-GeographicalDistribution: {ex.Message}");
                return BadRequest("Error en el servicio");
            }
        }

        /// <summary>
        /// Get "Datos a fecha" value for wordpress site
        /// </summary>
        /// <returns></returns>
        [Route("DataToDateCarteras"), HttpGet]
        [ProducesResponseType(typeof(List<KeyValuePair<string, string>>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> DataToDateCarteras()
        {
            try
            {
                var fecha = await carteraService.GetDataToDate().ConfigureAwait(false);

                if (!fecha.HasValue)
                {
                    return NotFound();
                }

                string key = "DataToDate";
                string value = fecha.Value.ToString("dd/MM/yyyy");

                var returnValue = new KeyValuePair<string, string>(key, value);

                var lReturnValue = new List<KeyValuePair<string, string>?>
                {
                    returnValue
                };
                return Ok(lReturnValue);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error CarterasController-DataToDateCarteras: {ex.Message}");
                return BadRequest("Error en el servicio");
            }
        }
    }
}