using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Remediation;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Shared;
using BESTINVER.GestorAltas.Domain.Interfaces;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Web.Management.Models.Dashboard;
using BESTINVER.GestorAltas.Web.Management.Models.Remediacion;
using BESTINVER.GestorAltas.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Controllers
{
    [Authorize]
    public class RemediacionController : TimezoneController
    {
        private readonly IRemediationService remediationService;
        private readonly IMapper mapper;

        public RemediacionController(IRemediationService remediationService, IMapper mapper)
        {
            this.remediationService = remediationService;
            this.mapper = mapper;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> CheckRequestStatus(string idClient, bool changeLog)
        {
            RemediationStatusModel result = null;

            if (string.IsNullOrEmpty(idClient))
            {
                return NoContent();
            }
            else
            {
                var resultReq = await remediationService.GetRequestByApplicantDniOrRdCode(idClient, changeLog).ConfigureAwait(false);

                if (resultReq == null)
                {
                    //Llamar procedimiento almacenado para que busque por código cliente o dni en RD.
                    result = new RemediationStatusModel
                    {
                        DNI = idClient
                    };
                    return PartialView("_CheckRequestStatusNotInRemediacionView", result);
                }
                else
                {
                    result = mapper.Map<RemediationStatusModel>(resultReq);
                }

                return PartialView("_CheckRequestStatusView", result);
            }
        }

        public async Task<IActionResult> CotitularNotRemediated(string rdTitular)
        {
            var result = await remediationService.GetIntervenersByClientId(rdTitular).ConfigureAwait(false);
            var notRemediated = result.Where(a => a.PendingRemedy.HasValue && a.PendingRemedy.Value == true);
            var model = mapper.Map<IEnumerable<NotRemediatedModel>>(notRemediated);
            var req = await remediationService.GetRequestByRdcode(rdTitular).ConfigureAwait(false);
            if (req != null)
            {
                var statusId = (RequestStatusEnum)req.RemediacionRequestStatus.OrderByDescending(a => a.Id).FirstOrDefault()?.IdStatus;
                model.ToList().ForEach(s =>
                {
                    s.TipoEnvio = (SendTypeEnum)req.SendType;
                    s.UrlRemediacion = req.UrlToken;
                    s.Status = statusId;
                });
            }
            return PartialView("_CotitularNotRemediatedView", model);
        }

        public async Task<IActionResult> GetCotitularNotRemediatedByDNIClienteCod(string rdTitular)
        {
            var result = await remediationService.GetIntervenersByDocumentNumberOrClientId(rdTitular).ConfigureAwait(false);
            if (result == null || !result.Any())
            {
                return NoContent();
            }
            var notRemediated = result.Where(a => a.PendingRemedy.HasValue && a.PendingRemedy.Value == true);
            var model = mapper.Map<IEnumerable<NotRemediatedModel>>(notRemediated);
            var req = await remediationService.GetRequestByRdcode(rdTitular).ConfigureAwait(false);

            if (req != null)
            {
                var statusId = (RequestStatusEnum)req.RemediacionRequestStatus.OrderByDescending(a => a.Id).FirstOrDefault()?.IdStatus;
                model.ToList().ForEach(s =>
                {
                    s.TipoEnvio = (SendTypeEnum)req.SendType;
                    s.UrlRemediacion = req.UrlToken;
                    s.Status = statusId;
                });
            }


            if (model == null || !model.Any())
            {
                return NoContent();
            }

            return View("_CotitularNotRemediatedNotInRemediacionView", model);
        }

        public async Task<IActionResult> UpdateUrls()
        {
            var result = false;
            try
            {
                result = await remediationService.GenerateLostShortUrl();
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
        public async Task<IActionResult> UpdateSendType(Guid requestId, SendTypeEnum type)
        {
            var remedReq = await remediationService.GetRequestByRequestId(requestId.ToString()).ConfigureAwait(false);
            remedReq.Applicant.ApplicantIDDocuments = remedReq.Applicant.ApplicantIDDocuments.Where(x => !string.IsNullOrWhiteSpace(x.Number));
            remedReq.SendType = (int)type;
            remedReq.RemediationChannelType = (type == SendTypeEnum.Postal ? null : remedReq.RemediationChannelType);
            var result = await remediationService.AddUpdateRequest(remedReq).ConfigureAwait(false);
            var model = mapper.Map<RemediationStatusModel>(result);
            return PartialView("_CheckRequestStatusView", model);
        }

        [HttpGet]
        public async Task<IActionResult> SetRemediacionStatus(Guid requestId, RequestStatusEnum status, string description)
        {
            var remedReqStatus = new RemediacionRequestStatus
            {
                IdRemediacionRequest = requestId,
                IdStatus = (int)status,
                Created = DateTime.UtcNow,
                Description = description
            };
            var result = await remediationService.AddStatus(remedReqStatus).ConfigureAwait(false);

            var remmodel = await remediationService.GetRequestByRequestId(requestId.ToString()).ConfigureAwait(false);


            if (status == RequestStatusEnum.NoIniciado
                && remmodel.RemediacionRequestStatus.Any(s => s.IdStatus == (int)RequestStatusEnum.SolicitudFinalizadaParcialmente)
                && remmodel.RequestType == (int)RequestTypeEnum.Test_DNI)
            {
                remmodel.RequestType = (int)RequestTypeEnum.DNI;
                remmodel = await remediationService.AddUpdateRequest(remmodel).ConfigureAwait(false);
            }

            var model = mapper.Map<RemediationStatusModel>(remmodel);
            return PartialView("_CheckRequestStatusView", model);
        }

        [HttpGet]
        public async Task<IActionResult> UpdateRequestType(Guid requestId, RequestTypeEnum type)
        {
            var remedReq = await remediationService.GetRequestByRequestId(requestId.ToString()).ConfigureAwait(false);
            remedReq.RequestType = (int)type;
            var result = await remediationService.AddUpdateRequest(remedReq).ConfigureAwait(false);
            var model = mapper.Map<RemediationStatusModel>(result);
            return PartialView("_CheckRequestStatusView", model);
        }

        [HttpGet]
        public async Task<IActionResult> UpdateChannel(Guid requestId, RemediationChannelType channel)
        {
            if (string.IsNullOrEmpty(User.Identity.Name))
            { 
                throw new Exception("Sesión caducada");
            }

            var remedReq = await remediationService.GetRequestByRequestId(requestId.ToString()).ConfigureAwait(false);

            remedReq.UserName = User.Identity.Name;
            if (channel == RemediationChannelType.NoAplica)
            {
                remedReq.RemediationChannelType = null;
            }
            else
            {
                remedReq.RemediationChannelType = (int)channel;
                remedReq.SendType = (int)SendTypeEnum.Postal;
            }
            var result = await remediationService.AddUpdateRequest(remedReq).ConfigureAwait(false);
            var model = mapper.Map<RemediationStatusModel>(result);
            return PartialView("_CheckRequestStatusView", model);
        }

        [HttpGet]
        public async Task<IActionResult> UpdateDniExpiration(Guid requestId, DateTime? date = null, bool? notExpiry = null)
        {
            var remedReq = await remediationService.GetRequestByRequestId(requestId.ToString()).ConfigureAwait(false);
            if (date.HasValue)
            {
                remedReq.Applicant.IDDocumentExpirationDate = date;
                remedReq.Applicant.IDDocumentIsPermanent = false;
            }
            else
            {
                if (notExpiry.HasValue)
                {
                    remedReq.Applicant.IDDocumentIsPermanent = notExpiry;
                    remedReq.Applicant.IDDocumentExpirationDate = null;
                }
            }

            var result = await remediationService.AddUpdateRequest(remedReq).ConfigureAwait(false);
            await remediationService.UpdateCreateApplicant(remedReq.Applicant).ConfigureAwait(false);


            var model = mapper.Map<RemediationStatusModel>(result);
            return PartialView("_CheckRequestStatusView", model);
        }

        [HttpGet]
        public async Task<IActionResult> SetRemediationUser(Guid requestId)
        {
            var remedReq = await remediationService.GetRequestByRequestId(requestId.ToString()).ConfigureAwait(false);
            remedReq.UserName = User.Identity.Name;
            await remediationService.AddUpdateRequest(remedReq).ConfigureAwait(false);
            var url = remedReq.UrlToken;

            return Json(new
            {
                url
            });

        }

        [HttpGet]
        public async Task<IActionResult> FilterDigitalRequests(JQueryDataTableParamModel p, DateTime? from, DateTime? to, RequestStatusEnum status, DateTime? laststatusdate)
        {
            string[] cols = { "Id", "Applicant.DNI", "Applicant.ClientCode", "Applicant.Email", "Created", "Applicant.Surname" };

            var filter = new PaginatedSearch<RemediationRequestDashboardSearch>
            {
                Search = new RemediationRequestDashboardSearch
                {
                    CurrentStatusId = (int)status,
                    FromCreated = from,
                    ToCreated = to,
                    LastStatusDate = laststatusdate
                },
                Limit = p.IDisplayLength,
                Offset = p.IDisplayStart,
                Sort = new Sort
                {
                    SortField = cols[p.ISortCol_0],
                    SortDirection = (p.SSortDir_0 == "asc"
                 ? BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection.Asc
                 : BestInver.WebPrivada.Shared.Models.Shared.Enums.SortDirection.Desc)
                }
            };
            var displayedItems = await remediationService.RequestDashboardSearch(filter).ConfigureAwait(false);

            var results = mapper.Map<IEnumerable<FilterDigitalRequestsResponseModel>>(displayedItems);

            return JsonTableResults(p, displayedItems, results);
        }

        [HttpPost]
        public async Task<IActionResult> ResendOperation(Guid requestId)
        {
            var result = await remediationService.ResendOperation(requestId);

            if (result)
            {
                return Json(new { success = true, message = "Reenvío realizado correctamente" });
            }
            else
            {
                return BadRequest(new { success = false, message = "Error al reenviar a operaciones" });
            }
        }

        private ActionResult JsonTableResults<TModel>(JQueryDataTableParamModel p, PaginatedResult<RemediacionRequest> displayedItems, IEnumerable<TModel> results)
            where TModel : FilterDigitalRequestsResponseModel
        {
            return Json(new JsonTableResultsModel
            {
                SEcho = p.SEcho,
                ITotalRecords = displayedItems.Total,
                ITotalDisplayRecords = displayedItems.Total,
                AaData = results.Select(x => x.ToTable())
            });
        }
    }
}