using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Operations;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Models;
using BESTINVER.GestorAltas.Web.Public.Models.Register;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Linq;

namespace BESTINVER.GestorAltas.Web.Public.Controllers
{
    public class MasterController : Controller
    {
        private readonly ISignUpService signUpService;
        private readonly ITestService testService;
        private readonly IMapper mapper;
        private readonly IOperationsService operationsService;
        private readonly ILogger<MasterController> logger;

        public MasterController(ISignUpService signUpService,
            ITestService testService,
            IMapper mapper,
            IOperationsService operationsService,
            ILogger<MasterController> logger)
        {
            this.signUpService = signUpService;
            this.testService = testService;
            this.mapper = mapper;
            this.operationsService = operationsService;
            this.logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult> GetOperationTypes(int productType, int applicantType)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                else
                {
                    var result = await signUpService.GetOperationTypes(productType, applicantType).ConfigureAwait(false);
                    return Ok(mapper.Map<IEnumerable<Valor>>(result));
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "MasterController-GetOperationTypes, error: {Message}", ex.Message);
                return StatusCode((int)System.Net.HttpStatusCode.InternalServerError, ex.GetBaseException().Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetQuestions(int requestApplicantType, int applicantType)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                else
                {
                    var result = await testService.GetQuestions(requestApplicantType, applicantType).ConfigureAwait(false);
                    var questions = mapper.Map<IEnumerable<QuestionModel>>(result);
                    return Ok(questions);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "MasterController-GetQuestions, error: {Message}", ex.Message);
                return StatusCode((int)System.Net.HttpStatusCode.InternalServerError, ex.GetBaseException().Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetAllQuestions()
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                else
                {
                    var resultFisica = await testService.GetQuestions(1, 1).ConfigureAwait(false);
                    var questionsFisica = mapper.Map<IEnumerable<QuestionModel>>(resultFisica);

                    var resultJuridica = await testService.GetQuestions(1, 2).ConfigureAwait(false);
                    var questionsJuridica = mapper.Map<IEnumerable<QuestionModel>>(resultJuridica);

                    IEnumerable<QuestionModel> result = questionsFisica.Union(questionsJuridica);

                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "MasterController-GetQuestions, error: {Message}", ex.Message);
                return StatusCode((int)System.Net.HttpStatusCode.InternalServerError, ex.GetBaseException().Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetQuestionsByProduct(int product)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                else
                {
                    var result = await testService.GetQuestions(1, 1, product).ConfigureAwait(false);
                    var questions = mapper.Map<IEnumerable<QuestionModel>>(result);
                    return Ok(questions);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "MasterController-GetQuestions, error: {Message}", ex.Message);
                return StatusCode((int)System.Net.HttpStatusCode.InternalServerError, ex.GetBaseException().Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult> FundsData(string letters, int idProductType)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                else
                {
                    var searchModel = new PaginatedSearch<FundSearch>();
                    searchModel.Limit = 20;
                    searchModel.Offset = 0;
                    searchModel.Search.FundName = letters;
                    searchModel.Search.ProductType = new BestInver.WebPrivada.Shared.Models.Microservices.Products.ProductType
                    {
                        Id = idProductType == 1 ? "FP" : "FI"
                    };

                    var result = await operationsService.SearchAutocomplete(searchModel).ConfigureAwait(false);
                    var data = mapper.Map<IEnumerable<FundSearchResult>>(result.Items);

                    return Ok(data);
                }
            }
            catch
            {
                return Ok(new List<FundSearchResult>());
            }
        }

        [HttpGet]
        public async Task<ActionResult> FundDetail(string fundId, int fundType)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                else
                {
                    var type = "FI";
                    if (fundType == 1)
                    {
                        type = "FP";
                    }
                    else if (fundType == 4)
                    {
                        type = "EPSV";
                    }                    

                    var result = await operationsService.FundDetail(fundId, type).ConfigureAwait(false);
                    if (result == null)
                    {
                        return NotFound();
                    }
                    return Ok(result);
                }
            }
            catch (Exception ex) { 
                return StatusCode((int)System.Net.HttpStatusCode.InternalServerError, ex.GetBaseException().Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult> PlansData(string letters, int? idProductType = null)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                else
                {
                    var id = "FP";
                    if (idProductType == 4)//EPSV
                    {
                        id = EpsvConst.productTypeId;
                    }
                    var searchModel = new PaginatedSearch<FundSearch>();
                    searchModel.Limit = 20;
                    searchModel.Offset = 0;
                    searchModel.Search.FundName = letters;
                    searchModel.Search.ProductType = new BestInver.WebPrivada.Shared.Models.Microservices.Products.ProductType
                    {
                        Id = id
                    };

                    var result = await operationsService.SearchAutocomplete(searchModel).ConfigureAwait(false);
                    var data = mapper.Map<IEnumerable<FundSearchResult>>(result.Items);

                    return Ok(data);
                }
            }
            catch
            {
                return Ok(new List<FundSearchResult>());
            }
        }

        [HttpGet]
        public async Task<ActionResult> IsinData(string letters)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                else
                {
                    var searchModel = new PaginatedSearch<FundSearch>();
                    searchModel.Limit = 20;
                    searchModel.Offset = 0;
                    searchModel.Search.FundName = letters;
                    searchModel.Search.ProductType = new BestInver.WebPrivada.Shared.Models.Microservices.Products.ProductType
                    {
                        Id = "FI"
                    };

                    if (string.IsNullOrEmpty(letters))
                    {
                        return Ok(new List<FundSearchResult>());
                    }
                    else
                    {
                        var result = await operationsService.SearchAutocomplete(searchModel).ConfigureAwait(false);
                        var data = mapper.Map<IEnumerable<FundSearchResult>>(result.Items);

                        return Ok(data);
                    }
                }
            }
            catch
            {
                return Ok(new List<FundSearchResult>());
            }
        }

        [HttpGet]
        public async Task<ActionResult> ComsData(string letters, string isin)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                else
                {
                    var searchModel = new PaginatedSearch<MarketerSearchByISIN>();
                    searchModel.Limit = 20;
                    searchModel.Offset = 0;
                    searchModel.Search.ISIN = isin;
                    searchModel.Search.AgentName = letters;

                    var result = await operationsService.SearchByIsin(searchModel).ConfigureAwait(false);
                    var data = mapper.Map<IEnumerable<MarketerSearchResult>>(result.Items);

                    return Ok(data);
                }
            }
            catch
            {
                return Ok(new List<MarketerSearchResult>());
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}